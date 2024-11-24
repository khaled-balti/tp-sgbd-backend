import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { LicenceService } from './licence.service';
import { CreateLicenceDto } from './dto/create-licence.dto';
import { UpdateLicenceDto } from './dto/update-licence.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Request } from 'express';

@Controller('licence')
export class LicenceController {
  constructor(private readonly licenceService: LicenceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Req() req: Request,
    @Body() createLicenceDto: Omit<CreateLicenceDto, 'logo'>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.licenceService.create(req.user, { ...createLicenceDto, logo });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.licenceService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.licenceService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateLicenceDto: Omit<UpdateLicenceDto, 'logo'>,
    @UploadedFile() logo?: Express.Multer.File
  ) {
    return this.licenceService.update(+id, {logo, ...updateLicenceDto});
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.licenceService.remove(+id);
  }
}
