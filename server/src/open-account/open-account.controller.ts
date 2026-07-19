import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OpenAccountService } from './open-account.service';
import { CreateOpenAccountDto } from './dto/create-open-account.dto';
import { UpdateOpenAccountDto } from './dto/update-open-account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { AccountStatus } from 'src/generated/client';

@Controller('open-account')
export class OpenAccountController {
  constructor(private readonly openAccountService: OpenAccountService) {}

  @Post()
  async create(@Body() createOpenAccountDto: CreateOpenAccountDto) {
    const account = await this.openAccountService.create(createOpenAccountDto);
    return { data: account };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.openAccountService.getStats();
  }

  @Get('track')
  async track(@Query('applicationId') applicationId: string) {
    const account = await this.openAccountService.findByApplicationId(applicationId);
    return {
      data: {
        applicationId: account.applicationId,
        applicantName: `${account.firstName} ${account.lastName}`,
        status: account.status,
        statusNotes: account.statusNotes,
        createdAt: account.createdAt,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: AccountStatus,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    
    const result = await this.openAccountService.findAll(pageNum, limitNum, search, status);
    const stats = await this.openAccountService.getStats();
    
    return {
      data: result.items,
      meta: {
        totalItems: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limitNum),
      },
      stats,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const account = await this.openAccountService.findOne(id);
    return { data: account };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOpenAccountDto: UpdateOpenAccountDto,
  ) {
    const account = await this.openAccountService.update(id, updateOpenAccountDto);
    return { data: account };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const account = await this.openAccountService.remove(id);
    return { data: account };
  }
}
