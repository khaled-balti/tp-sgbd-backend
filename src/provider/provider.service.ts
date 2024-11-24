import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    private addressService: AddressService,
  ) {}
  async create(user, createProviderDto: CreateProviderDto) {
    const { logo, state, city, ...restInputs } = createProviderDto;
    const country = 'Tunisia';
    console.log(logo);
    if (logo) {
      await this.uploadImage(logo, true);
    }
    const newAddress = await this.addressService.create({
      country,
      state,
      city,
    });
    const newProvider = await this.providerRepository.create({
      ...restInputs,
      ...(logo ? { logo: logo.originalname } : {}),
    });
    newProvider.address = newAddress;
    newProvider.user = user?.id;
    await this.providerRepository.save(newProvider);
    return {
      success: true,
      message: 'Provider created successfully',
      provider: newProvider,
    };
  }

  findAll() {
    return this.providerRepository.find({ relations: ['address', 'user'] });
  }

  findOne(id: number) {
    return this.providerRepository.findOne({
      where: { id },
      relations: ['address', 'user'],
    });
  }
  findOneByName(name: string) {
    return this.providerRepository.findOne({
      where: { name },
      relations: ['address', 'user'],
    });
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const provider = await this.findOne(id);
    if (!provider)
      throw new HttpException('Provider not found', HttpStatus.BAD_REQUEST);
    const { logo, city, state, ...restInputs } = updateProviderDto;
    const country = 'Tunisia';
    await this.addressService.update(provider.address?.id, {
      country,
      state,
      city,
    });
    if (logo) {
      await this.uploadImage(logo, true);
    }
    await this.providerRepository.update(
      { id },
      {
        ...restInputs,
        ...(logo ? { logo: logo.originalname } : {}),
      },
    );
    const updatedProvider = await this.findOne(id);
    return {
      success: true,
      message: 'Provider updated successfully',
      provider: updatedProvider,
    };
  }

  async remove(id: number) {
    const provider = await this.findOne(id);
    if (!provider)
      throw new HttpException('Provider not found', HttpStatus.BAD_REQUEST);
    await this.providerRepository.delete({ id });
    await this.addressService.remove(provider.address?.id);
    return {
      success: true,
      message: 'Provider deleted successfully',
    };
  }

  async uploadImage(
    file: Express.Multer.File,
    createFileInDirectory: boolean,
  ): Promise<boolean> {
    console.log('UPLOAD_IMAGE_CALLED', {
      file,
      createFileInDirectory,
    });

    return new Promise((resolve, reject) => {
      if (!file) return;
      if (createFileInDirectory) {
        const dirPath = join(process.cwd(), 'src', 'uploads'); // Use process.cwd() for the correct path
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }

        const writeStream = createWriteStream(
          `${dirPath}/${file.originalname}`,
        );
        writeStream.write(file.buffer);
        writeStream.end();

        writeStream.on('finish', () => {
          console.log('IMAGE_CREATED_IN_DIRECTORY');
          resolve(true);
        });

        writeStream.on('error', (error) => {
          console.log('IMAGE_UPLOAD_ERROR', error);
          reject(error);
        });
      } else {
        console.log('DATA_FROM_STREAM', file.buffer);
        console.log('END_OF_STREAM');
        resolve(true);
      }
    });
  }
}
