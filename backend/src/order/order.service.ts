import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/order.dto';
import {
  MongoFilmsRepository,
  ScheduleDocument,
} from 'src/repository/mongoFilms.repository';
import { FilmDocument } from 'src/repository/mongoFilms.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: MongoFilmsRepository) {}

  async createOrder(items: CreateOrderItemDto[]) {
    const updateFn = (film: FilmDocument) => {
      film.schedule.forEach((schedule: ScheduleDocument) => {
        items.forEach((item) => {
          if (item.session === schedule.id) {
            const seatStr = `${item.row}:${item.seat}`;
            if (schedule.taken.includes(seatStr)) {
              throw new Error(`Seat ${seatStr} is already taken`);
            }
            schedule.taken.push(seatStr);
          }
        });
      });
    };

    await this.filmsRepository.findByIdAndUpdate(
      updateFn,
      ...items.map((item) => item.film),
    );

    return {
      total: items.length,
      items: items.map((item) => ({
        ...item,
        id: '',
      })),
    };
  }
}
