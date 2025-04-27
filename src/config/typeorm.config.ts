import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from '../admins/entities/admin.entity';
import { User } from '../users/user.entity';
import { JobRequest } from '../job-requests/job-request.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DATABASE_HOST'),
    port: Number(config.get<string>('DATABASE_PORT')),
    username: config.get<string>('DATABASE_USERNAME'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),
    entities: [Admin, User, JobRequest],
  }),
};
