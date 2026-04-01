import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') || 'mongodb',
      url:
        configService.get<string>('DATABASE_URL') ||
        'mongodb://localhost:27017/film-react-nest',
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
  url: string;
}
