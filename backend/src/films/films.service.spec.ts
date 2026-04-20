import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

describe('FilmsService', () => {
  let filmsService: FilmsService;
  let filmsRepository: FilmsRepository;

  const schedule = {
    id: 'string',
    daytime: 'string',
    hall: 0,
    rows: 0,
    seats: 0,
    price: 0,
    taken: ['string', 'string'],
  };

  const film = {
    id: 'string',
    rating: 0,
    director: 'string',
    tags: ['string', 'string'],
    title: 'string',
    about: 'string',
    description: 'string',
    image: 'string',
    cover: 'string',
    schedule: [schedule],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAllFilms: jest.fn(() => Promise.resolve([{ ...film }])),
            findFilmById: jest.fn((id: string) =>
              Promise.resolve({ ...film, id }),
            ),
            findScheduleById: jest.fn((id: string) =>
              Promise.resolve({ ...schedule, id }),
            ),
            updateSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    filmsService = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);
  });

  it('.getFilms should call findAllFilms method of the repository', async () => {
    await filmsService.getFilms();
    expect(filmsRepository.findAllFilms).toHaveBeenCalled();
  });

  it('.getFilmSchedule should call findScheduleById method of the repository', async () => {
    const id = 'string';
    await filmsService.getFilmSchedule(id);
    expect(filmsRepository.findFilmById).toHaveBeenCalledWith(id);
  });
});
