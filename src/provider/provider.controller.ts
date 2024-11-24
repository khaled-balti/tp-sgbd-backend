import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Request } from 'express';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Req() req: Request,
    @Body() createProviderDto: Omit<CreateProviderDto, 'logo'>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.providerService.create(req.user, {
      ...createProviderDto,
      logo,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.providerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.providerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateProviderDto: Omit<UpdateProviderDto, 'logo'>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.providerService.update(+id, { logo, ...updateProviderDto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.providerService.remove(+id);
  }
}
