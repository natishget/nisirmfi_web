import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // async create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }

  async changePassword(id: string, newPassword: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedNewPassword = bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
    return {
      message: 'Password updated successfully',
      user: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
    };
  }
}
