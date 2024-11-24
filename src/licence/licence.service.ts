import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLicenceDto } from './dto/create-licence.dto';
import { UpdateLicenceDto } from './dto/update-licence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Licence } from './entities/licence.entity';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
@Injectable()
export class LicenceService {
  constructor(
    @InjectRepository(Licence) private licenceRepository: Repository<Licence>
  ) {}

  async create(user, createLicenceDto: CreateLicenceDto) {
    const {logo, ...restInputs} = createLicenceDto
    if (logo) {
      await this.uploadImage(logo, true)
    }
    const newLicence = await this.licenceRepository.create({...restInputs, ...(logo ? { logo: logo.originalname } : {})})
    newLicence.user = user?.id
    await this.licenceRepository.save(newLicence)
    return {
      success: true,
      message: "Licence created successfully",
      licence: newLicence
    }
  }

  findAll() {
    return this.licenceRepository.find({relations: ['user']})
  }

  findOne(id: number) {
    return this.licenceRepository.findOne({where: {id}, relations: ['user']})
  }

  findOneByName(name: string) {
    return this.licenceRepository.findOne({where: {name}, relations: ['user']})
  }

  async update(id: number, updateLicenceDto: UpdateLicenceDto) {
    const licence = await this.findOne(id)
    if (!licence) throw new HttpException("Licence not found", HttpStatus.BAD_REQUEST)
    const {logo, ...restInputs} = updateLicenceDto
    if (logo) {
      await this.uploadImage(logo, true);
    }
    await this.licenceRepository.update(
      { id },
      { 
        ...restInputs, 
        ...(logo ? { logo: logo.originalname } : {})
      }
    );
    const updatedLicence = await this.findOne(id)
    return {
      success: true,
      message: "Licence updated successfully",
      licence: updatedLicence
    }
  }

  async remove(id: number) {
    const licence = await this.findOne(id)
    if (!licence) throw new HttpException("Licence not found", HttpStatus.BAD_REQUEST)
    await this.licenceRepository.delete({id})
    return {
      success: true,
      message: "Licence deleted successfully"
    } 
  }

  async uploadImage(file: Express.Multer.File, createFileInDirectory: boolean): Promise<boolean> {
    console.log('UPLOAD_IMAGE_CALLED', {
        file,
        createFileInDirectory,
    });
    if (!file) return
    return new Promise((resolve, reject) => {
        if (createFileInDirectory) {
            const dirPath = join(process.cwd(), 'src', 'uploads'); // Use process.cwd() for the correct path
            if (!existsSync(dirPath)) {
                mkdirSync(dirPath, { recursive: true });
            }

            const writeStream = createWriteStream(`${dirPath}/${file.originalname}`);
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
