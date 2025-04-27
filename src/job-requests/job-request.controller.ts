import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JobRequestService } from './job-request.service';
import { JobRequest } from './job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-requests')
export class JobRequestController {
  constructor(private readonly jobRequestService: JobRequestService) {}

  @Post()
  async create(@Body() data: CreateJobRequestDto): Promise<JobRequest> {
    return this.jobRequestService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ): Promise<JobRequest[]> {
    const user = req.user;

    if (user.role !== 'admin') {
      throw new ForbiddenException('Доступ запрещен');
    }

    return this.jobRequestService.findAll(page, limit);
  }
}
