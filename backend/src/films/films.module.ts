import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { AppRepository } from 'src/repository/app.repository';

@Module({
  imports: [AppRepository],
  providers: [FilmsService],
  controllers: [FilmsController],
})
export class FilmsModule {}
