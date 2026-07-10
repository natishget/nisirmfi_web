import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // private handlePrismaError(e: unknown) {
  //   if (e && typeof e === 'object' && 'code' in (e as any)) {
  //     const err = e as Prisma.PrismaClientKnownRequestError;
  //     if (err.code === 'P2002')
  //       throw new ConflictException('Email already registered');
  //     throw new BadRequestException(err.message);
  //   }
  //   throw e;
  // }

  private sanitizeUser(user: {
    id: string;
    email: string;
    fullName: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  }
  async create(createAuthDto: CreateAuthDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: createAuthDto.email },
      });
      if (existing)
        throw new ConflictException('Email or Username already registered');

      const hash = await bcrypt.hash(
        createAuthDto.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
      );
      const created = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          fullName: createAuthDto.fullName,
          password: hash,
        },
      });

      return this.sanitizeUser(created);
    } catch (e) {
      // this.handlePrismaError(e);
      console.error(e);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          fullName: true,
          password: true,
        },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const match = await bcrypt.compare(password, user?.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = this.jwtService.sign({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      });
      return {
        access_token: token,
        message: 'Login successful',
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid credentials');
    }
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
