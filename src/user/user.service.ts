import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const {image, password, ...restInputs} = createUserDto
    if (image) {
      await this.uploadImage(image, true)
    }
    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = await this.userRepository.create({...(image ? { image: image.originalname } : {}), password: hashpassword, ...restInputs})
    await this.userRepository.save(newUser)
    return {
      success: true,
      message: "User created successfully",
      user: newUser
    }
  }

  findAll() {
    return this.userRepository.find()
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id})
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({email})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
  
    const { image, ...restInputs } = updateUserDto;
  
    if (image) {
      try {
        await this.uploadImage(image, true);
      } catch (error) {
        throw new HttpException("Image upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    await this.userRepository.update(
      { id },
      { 
        ...restInputs, 
        ...(image ? { image: image.originalname } : {})
      }
    );
  
    const updatedUser = await this.findOne(id);
    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser
    };
  }
  

  async remove(id: number) {
    const user = await this.findOne(id)
    if (!user) throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
    await this.userRepository.delete({id})
    return {
      success: true,
      message: "User deleted successfully"
    } 
  }

  async uploadImage(file: Express.Multer.File, createFileInDirectory: boolean): Promise<boolean> {
    console.log('UPLOAD_IMAGE_CALLED', {
        file,
        createFileInDirectory,
    });

    return new Promise((resolve, reject) => {
      if (!file) return
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
