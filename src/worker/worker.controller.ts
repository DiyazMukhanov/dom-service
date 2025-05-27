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
  ParseIntPipe,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker } from './entities/worker.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto): Promise<Worker> {
    return this.workerService.create(createWorkerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Get()
  async findAll(
    @Query('occupationId') occupationId?: string,
    @Query('isActive') isActive?: string,
    @Query('isEmailConfirmed') isEmailConfirmed?: string,
    @Query('cityId') cityId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ data: Worker[]; total: number }> {
    return this.workerService.findAll(
      occupationId ? +occupationId : undefined,
      isActive !== undefined ? isActive === 'true' : undefined,
      isEmailConfirmed !== undefined ? isEmailConfirmed === 'true' : undefined,
      cityId ? +cityId : undefined,
      +page,
      +limit,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ): Promise<Worker> {
    return this.workerService.update(id, updateWorkerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Post('send-email-confirmation/:id')
  async sendCodeToEmail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ code: string }> {
    return this.workerService.sendEmailConfirmation(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'admin')
  @Patch('confirm-email/:id')
  async confirmEmail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    return this.workerService.confirmEmail(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerService.remove(+id);
  }
}
