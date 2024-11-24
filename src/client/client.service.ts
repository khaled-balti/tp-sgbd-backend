import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private addressService: AddressService,
  ) {}

  async create(user, createClientDto: CreateClientDto) {
    const { state, city, ...restInputs } = createClientDto;
    const country = 'Tunisia';
    const newAddress = await this.addressService.create({
      country,
      state,
      city,
    });
    const newClient = await this.clientRepository.create(restInputs);
    newClient.address = newAddress;
    newClient.user = user?.id;
    await this.clientRepository.save(newClient);
    return {
      success: true,
      message: 'Client created Successfully',
      client: newClient,
    };
  }

  findAll() {
    return this.clientRepository.find({ relations: ['address', 'user'] });
  }

  findOne(id: number) {
    return this.clientRepository.findOne({
      where: { id },
      relations: ['address', 'user'],
    });
  }
  findOneByName(name: string) {
    return this.clientRepository.findOne({
      where: { first_name: name },
      relations: ['address', 'user'],
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const { state, city, ...restInputs } = updateClientDto;
    const country = 'Tunisia';
    const client = await this.findOne(id);
    if (!client)
      throw new HttpException('Client not found', HttpStatus.BAD_REQUEST);
    await this.addressService.update(client.address?.id, {
      country,
      state,
      city,
    });
    await this.clientRepository.update({ id }, { ...restInputs });
    const updatedClient = await this.findOne(id);
    return {
      success: true,
      message: 'Client updated Successfully',
      client: updatedClient,
    };
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client)
      throw new HttpException('client not found', HttpStatus.BAD_REQUEST);
    await this.clientRepository.delete({ id });
    await this.addressService.remove(client.address?.id);
    return {
      success: true,
      message: 'Client deleted sucessfully',
    };
  }
}
