import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import {
  FilmSchema,
  MongoFilmsRepository,
} from 'src/repository/mongoFilms.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }])],
  providers: [MongoFilmsRepository, FilmsService],
  controllers: [FilmsController],
  exports: [MongoFilmsRepository],
})
export class FilmsModule {}
