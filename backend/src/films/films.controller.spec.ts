import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getFilms: jest.fn(),
        getFilmSchedule: jest.fn(),
      })
      .compile();

    filmsController = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  it('.getFilms should call getFilms method of the service', () => {
    filmsController.getFilms();
    expect(filmsService.getFilms).toHaveBeenCalled();
  });

  it('.getFilmSchedule should call getFilmSchedule method of the service with right id', () => {
    const id = '123';
    filmsController.getFilmSchedule(id);
    expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(id);
  });
});
