import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') || 'postgres',
      host: configService.get<string>('DATABASE_HOST') || 'localhost',
      port: configService.get<number>('DATABASE_PORT') || 5432,
      name: configService.get<string>('DATABASE_NAME') || 'prac',
      username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
      password: configService.get<string>('DATABASE_PASSWORD') || 'postgres',
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [configProvider],
  exports: [configProvider],
})
export class AppConfigModule {}

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}
