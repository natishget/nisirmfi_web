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
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt_auth.guard';

function parseCookieMaxAgeMs(raw: string | undefined): number {
  if (!raw) return 60 * 60 * 1000;

  const value = raw.trim().toLowerCase();
  if (/^\d+$/.test(value)) return Number(value);

  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) return 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
}

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

  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, message } = await this.authService.login(
      loginAuthDto.email,
      loginAuthDto.password,
    );
    const isProduction = process.env.IS_PRODUCTION === 'true';

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: parseCookieMaxAgeMs(process.env.JWT_EXPIRATION_MS),
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
    const isProduction = process.env.IS_PRODUCTION === 'true';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
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
