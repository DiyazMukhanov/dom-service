import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from '../admins/entities/admin.entity';
import { User } from '../users/user.entity';
import { JobRequest } from '../job-requests/entities/job-request.entity';
import { City } from '../cities/entities/city.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const isProd = config.get<string>('NODE_ENV') === 'production';

    if (isProd) {
      return {
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
      };
    } else {
      return {
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get<string>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [Admin, User, JobRequest, City],
        synchronize: false,
      };
    }
  },
};
