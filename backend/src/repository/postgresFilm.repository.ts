import { Injectable } from '@nestjs/common';
import { FilmDTO, ScheduleDTO } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from '../films/entities/film.entity';
import { Repository } from 'typeorm';
import { Schedules } from '../films/entities/schedule.entity';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Films)
    private filmRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private scheduleRepository: Repository<Schedules>,
  ) {}

  async findAllFilms(): Promise<FilmDTO[]> {
    const items = await this.filmRepository.find({
      relations: { schedule: true },
    });
    return items.map(this.filmMapperFn);
  }

  async findFilmById(id: string): Promise<FilmDTO> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
    return film ? this.filmMapperFn(film) : null;
  }

  async findScheduleById(id: string): Promise<ScheduleDTO> {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    return schedule ? this.scheduleMapperFn(schedule) : null;
  }

  async updateSchedule(
    schedule: Partial<ScheduleDTO> & Pick<ScheduleDTO, 'id'>,
  ): Promise<void> {
    await this.scheduleRepository.update({ id: schedule.id }, schedule);
  }

  private scheduleMapperFn = (root: Schedules): ScheduleDTO => ({
    id: root.id,
    daytime: root.daytime,
    hall: root.hall,
    rows: root.rows,
    seats: root.seats,
    price: root.price,
    taken: root.taken,
  });

  private filmMapperFn = (root: Films): FilmDTO => ({
    id: root.id,
    rating: root.rating,
    director: root.director,
    tags: root.tags,
    title: root.title,
    about: root.about,
    description: root.description,
    image: root.image,
    cover: root.cover,
    schedule: root.schedule.map(this.scheduleMapperFn),
  });
}
