import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.careerService.findAll(+page, +limit);
  }

  @Get('active')
  findAllActive(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.careerService.findAllActive(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careerService.update(id, updateCareerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerService.remove(id);
  }
}
