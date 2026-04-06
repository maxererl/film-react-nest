import { FilmDTO, ScheduleDTO } from 'src/films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAllFilms(): Promise<FilmDTO[]>;
  abstract findFilmById(id: string): Promise<FilmDTO>;
  abstract findScheduleById(id: string): Promise<ScheduleDTO>;
  abstract updateSchedule(
    schedule: Partial<ScheduleDTO> & Pick<ScheduleDTO, 'id'>,
  ): Promise<void>;
}
