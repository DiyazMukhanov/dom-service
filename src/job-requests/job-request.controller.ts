import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { JobRequestService } from './job-request.service';
import { JobRequest } from './entities/job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';

@Controller('job-requests')
export class JobRequestController {
  constructor(private readonly jobRequestService: JobRequestService) {}

  @Post()
  async create(
    @Body() data: CreateJobRequestDto,
    @Req() req: Request,
  ): Promise<JobRequest> {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket?.remoteAddress ||
      'unknown';

    return this.jobRequestService.create(data, ip);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('cityId') cityId?: number,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('email') email?: string,
  ): Promise<{ data: JobRequest[]; total: number }> {
    return this.jobRequestService.findAll(
      page,
      limit,
      cityId,
      phoneNumber,
      email,
    );
  }

  @Patch('book/:id')
  async bookJobRequest(
    @Param('id') id: number,
    @Query('workerId') workerId: number,
  ): Promise<JobRequest> {
    return this.jobRequestService.book(id, workerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<JobRequest>,
  ): Promise<JobRequest> {
    return this.jobRequestService.updateRequest(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<JobRequest> {
    return this.jobRequestService.getOneRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.jobRequestService.deleteRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Patch('cancel/:id')
  async cancel(@Param('id') id: number): Promise<JobRequest> {
    return this.jobRequestService.cancelRequest(id);
  }
}
