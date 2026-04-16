import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(items: CreateOrderItemDto[]) {
    const schedules = await Promise.all(
      items.map((item) => this.filmsRepository.findScheduleById(item.session)),
    );

    items.forEach((item, index) => {
      const schedule = schedules[index];
      const seatStr = `${item.row}:${item.seat}`;
      if (schedule.taken.includes(seatStr)) {
        throw new Error(`Seat ${seatStr} is already taken`);
      }
    });

    await Promise.all(
      items.map((item, index) => {
        const schedule = schedules[index];
        const seatStr = `${item.row}:${item.seat}`;
        schedule.taken.push(seatStr);
        return this.filmsRepository.updateSchedule(schedule);
      }),
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
