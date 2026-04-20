import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from './films.repository';
import { Films } from '../films/entities/film.entity';
import { Schedules } from '../films/entities/schedule.entity';
import { PostgresFilmsRepository } from './postgresFilm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  providers: [
    {
      provide: FilmsRepository,
      useClass: PostgresFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class AppRepository {}
