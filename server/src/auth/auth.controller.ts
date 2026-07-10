import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { parse } from 'path';

interface AuthenticatedRequest extends Request {
  user: any; // replace `any` with your user type if available
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, message } = await this.authService.login(
      loginAuthDto.email,
      loginAuthDto.password,
    );
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.IS_PRODUCTION === 'true', // set to true in production (HTTPS)
      sameSite: process.env.IS_PRODUCTION === 'true' ? 'none' : 'lax', // 'none' needed for cross-site XHR; production requires secure:true
      maxAge: parseInt(process.env.JWT_EXPIRATION_MS || '6h'), // default to 1 hour
    });
    return { message, access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getMe(@Req() req: AuthenticatedRequest) {
    console.log('User:', req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
