export class FilmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: ScheduleDTO[];
}

export class ScheduleDTO {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export type GetFilmDTO = Omit<FilmDTO, 'schedule'>;

export type GetFilmsDTO = {
  total: number;
  items: GetFilmDTO[];
};

export type GetFilmSchedulesDTO = {
  total: number;
  items: ScheduleDTO[];
};
