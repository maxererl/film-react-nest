import { Injectable } from '@nestjs/common';
import { FilmDTO, GetFilmsDTO } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<GetFilmsDTO> {
    const films = await this.filmsRepository.findAllFilms().then((films) =>
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
      .findFilmById(id)
      .then((film) => film.schedule);
    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
