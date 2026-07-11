import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private static readonly userSelect = {
    id: true,
    email: true,
    fullName: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isExistingUser = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (isExistingUser) {
        throw new ConflictException(
          'Unable to Create User. Please Try Another Email or Password',
        );
      }

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
      );

      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: UserService.userSelect,
      });

      return newUser;
    } catch (error: unknown) {
      this.handlePrismaError(error, 'create user');
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: UserService.userSelect,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: UserService.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: UserService.userSelect,
      });
    } catch (error: unknown) {
      this.handlePrismaError(error, 'update user');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: UserService.userSelect,
      });
    } catch (error: unknown) {
      this.handlePrismaError(error, 'delete user');
    }
  }

  async changePassword(id: string, newPassword: string) {
    try {
      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
      );

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
        select: UserService.userSelect,
      });

      return {
        message: 'Password updated successfully',
        user: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
      };
    } catch (error: unknown) {
      this.handlePrismaError(error, 'update password');
    }
  }

  private handlePrismaError(error: unknown, action: string): never {
    console.error(`User Error during ${action}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }

      if (error.code === 'P2002') {
        throw new ConflictException(
          'A user with the same unique field already exists',
        );
      }
    }

    throw new InternalServerErrorException(`Failed to ${action}`);
  }
}
