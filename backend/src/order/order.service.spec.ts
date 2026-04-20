import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { randomUUID as uuid } from 'crypto';
import { CreateOrderItemDto } from './dto/order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: FilmsRepository;

  beforeEach(async () => {
    const schedule = {
      id: 'string',
      daytime: 'string',
      hall: 0,
      rows: 0,
      seats: 0,
      price: 0,
      taken: ['1:3'],
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: {
            findAllFilms: jest.fn(() => Promise.resolve([{ ...film }])),
            findFilmById: jest.fn((id: string) =>
              Promise.resolve({ ...film, id }),
            ),
            findScheduleById: jest.fn((id: string) =>
              Promise.resolve({ ...schedule, id, taken: [...schedule.taken] }),
            ),
            updateSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);
  });

  it('.createOrder should add seat to taken', async () => {
    const orderItems: CreateOrderItemDto[] = [
      {
        film: uuid(),
        session: uuid(),
        daytime: new Date().toISOString(),
        row: 1,
        seat: 1,
        price: 100,
      },
      {
        film: uuid(),
        session: uuid(),
        daytime: new Date().toISOString(),
        row: 2,
        seat: 1,
        price: 100,
      },
    ];

    const schedules = await Promise.all(
      orderItems.map((i) => filmsRepository.findScheduleById(i.session)),
    );

    const updatedSchedules = schedules.map(({ ...schedule }, index) => {
      const item = orderItems[index];
      schedule.taken.push(`${item.row}:${item.seat}`);
      return schedule;
    });

    await service.createOrder(orderItems);
    updatedSchedules.forEach((us, i) => {
      expect(filmsRepository.updateSchedule).toHaveBeenNthCalledWith(i + 1, us);
    });
  });

  it('.createOrder should throw error if two same seats in order', async () => {
    const filmId = uuid();
    const sessionId = uuid();
    const orderItems: CreateOrderItemDto[] = [
      {
        film: filmId,
        session: sessionId,
        daytime: new Date().toISOString(),
        row: 1,
        seat: 1,
        price: 100,
      },
      {
        film: filmId,
        session: sessionId,
        daytime: new Date().toISOString(),
        row: 1,
        seat: 1,
        price: 100,
      },
    ];

    await expect(service.createOrder(orderItems)).rejects.toThrow(
      'Seat 1:1 is already taken',
    );
    expect(filmsRepository.updateSchedule).not.toHaveBeenCalled();
  });

  it('.createOrder should throw error if any seat in order is already taken', async () => {
    const filmId = uuid();
    const sessionId = uuid();
    const orderItems: CreateOrderItemDto[] = [
      {
        film: filmId,
        session: sessionId,
        daytime: new Date().toISOString(),
        row: 1,
        seat: 1,
        price: 100,
      },
      {
        film: filmId,
        session: sessionId,
        daytime: new Date().toISOString(),
        row: 1,
        seat: 3,
        price: 100,
      },
    ];

    await expect(service.createOrder(orderItems)).rejects.toThrow(
      'Seat 1:3 is already taken',
    );
    expect(filmsRepository.updateSchedule).not.toHaveBeenCalled();
  });
});
