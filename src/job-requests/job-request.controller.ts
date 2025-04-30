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
} from '@nestjs/common';
import { JobRequestService } from './job-request.service';
import { JobRequest } from './entities/job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('job-requests')
export class JobRequestController {
  constructor(private readonly jobRequestService: JobRequestService) {}

  @Post()
  async create(@Body() data: CreateJobRequestDto): Promise<JobRequest> {
    return this.jobRequestService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: JobRequest[]; total: number }> {
    return this.jobRequestService.findAll(page, limit);
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
}
