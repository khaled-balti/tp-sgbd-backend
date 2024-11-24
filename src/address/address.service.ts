import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) {}
  async create(createAddressDto: CreateAddressDto) {
    const newAddress = await this.addressRepository.create(createAddressDto)
    return this.addressRepository.save(newAddress)
  }

  findAll() {
    return this.addressRepository.find()
  }

  findOne(id: number) {
    return this.addressRepository.findOneBy({id})
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id)
    if (!address) throw new HttpException("address not found", HttpStatus.BAD_REQUEST)
    return this.addressRepository.update({id}, {...updateAddressDto})

  }

  async remove(id: number) {
    const address = await this.findOne(id)
    if (!address) throw new HttpException("address not found", HttpStatus.BAD_REQUEST)
    await this.addressRepository.delete({id})
    return {
      success: true,
      message: 'Address deleted sucessfully'
    }
  }
}
