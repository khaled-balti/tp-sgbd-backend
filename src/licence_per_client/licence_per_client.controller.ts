import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LicencePerClientService } from './licence_per_client.service';
import { CreateLicencePerClientDto } from './dto/create-licence_per_client.dto';
import { UpdateLicencePerClientDto } from './dto/update-licence_per_client.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('licence-per-client')
export class LicencePerClientController {
  constructor(
    private readonly licencePerClientService: LicencePerClientService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request,
    @Body() createLicencePerClientDto: CreateLicencePerClientDto,
  ) {
    return this.licencePerClientService.create(
      req.user,
      createLicencePerClientDto,
    );
  }

  @Get()
  findAll() {
    return this.licencePerClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licencePerClientService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateLicencePerClientDto: UpdateLicencePerClientDto,
  ) {
    return this.licencePerClientService.update(+id, updateLicencePerClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licencePerClientService.remove(+id);
  }
}
