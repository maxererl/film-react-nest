import { Injectable } from '@nestjs/common';
import { MongoFilmsRepository } from 'src/repository/mongoFilms.repository';
import { FilmDTO, GetFilmsDTO } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: MongoFilmsRepository) {}

  async getFilms(): Promise<GetFilmsDTO> {
    const films = await this.filmsRepository.findAll().then((films) =>
      films.map((film) => {
        delete film.schedule;
        return film as Omit<FilmDTO, 'schedule'>;
      }),
    );
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmSchedule(id: string) {
    const schedule = await this.filmsRepository
      .findById(id)
      .then((film) => film.schedule);
    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
