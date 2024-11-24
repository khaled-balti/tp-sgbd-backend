import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLicencePerClientDto } from './dto/create-licence_per_client.dto';
import { UpdateLicencePerClientDto } from './dto/update-licence_per_client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicencePerClient } from './entities/licence_per_client.entity';
import { ClientService } from 'src/client/client.service';
import { LicenceService } from 'src/licence/licence.service';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class LicencePerClientService {
  constructor(
    @InjectRepository(LicencePerClient)
    private licencePerClientRepository: Repository<LicencePerClient>,
    private clientService: ClientService,
    private licenceService: LicenceService,
    private providerService: ProviderService,
  ) {}
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  async create(user, createLicencePerClientDto: CreateLicencePerClientDto) {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dateString = `${day} ${this.months[month]} ${year}`;
    const { client, licence, provider } = createLicencePerClientDto;
    const quantity = 1;
    const clientSearched = await this.clientService.findOne(+client);
    if (!clientSearched)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const licenceSearched = await this.licenceService.findOne(+licence);
    if (!licenceSearched)
      throw new HttpException('licence not found', HttpStatus.BAD_REQUEST);
    const providerSearched = await this.providerService.findOne(+provider);
    if (!providerSearched)
      throw new HttpException('provider not found', HttpStatus.BAD_REQUEST);
    const newLicencePerClient = await this.licencePerClientRepository.create({
      purchase_date: dateString,
      quantity: quantity,
      client: clientSearched,
      provider: providerSearched,
      licence: licenceSearched,
      user: user?.id,
    });
    await this.licencePerClientRepository.save(newLicencePerClient);
    return {
      success: true,
      message: 'LicencePerClient created successfully',
      licence: newLicencePerClient,
    };
  }

  findAll() {
    return this.licencePerClientRepository.find({
      relations: [
        'licence',
        'client',
        'client.address',
        'provider.address',
        'provider',
        'user',
      ],
    });
  }

  findOne(id: number) {
    return this.licencePerClientRepository.findOne({
      where: { id },
      relations: [
        'licence',
        'client',
        'client.address',
        'provider.address',
        'provider',
        'user',
      ],
    });
  }
  async update(
    id: number,
    updateLicencePerClientDto: UpdateLicencePerClientDto,
  ) {
    const order = await this.findOne(id);
    if (!order)
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    const { client, licence, provider } = updateLicencePerClientDto;
    const quantity = 1;
    const clientSearched = await this.clientService.findOne(+client);
    if (!clientSearched)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const licenceSearched = await this.licenceService.findOne(+licence);
    if (!licenceSearched)
      throw new HttpException('licence not found', HttpStatus.BAD_REQUEST);
    const providerSearched = await this.providerService.findOne(+provider);
    if (!providerSearched)
      throw new HttpException('provider not found', HttpStatus.BAD_REQUEST);
    await this.licencePerClientRepository.update(
      { id },
      {
        client: clientSearched,
        provider: providerSearched,
        licence: licenceSearched,
        quantity,
      },
    );
    const orderUpdated = await this.findOne(id);
    return {
      success: true,
      message: 'Order updated successfully',
      order: orderUpdated,
    };
  }
  async remove(id: number) {
    const licencePerClient = await this.findOne(id);
    if (!licencePerClient)
      throw new HttpException('Licence not found', HttpStatus.BAD_REQUEST);
    await this.licencePerClientRepository.delete({ id });
    return {
      success: true,
      message: 'LicencePerClient deleted successfully',
    };
  }
}
