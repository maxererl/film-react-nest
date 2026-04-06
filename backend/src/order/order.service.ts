import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/order.dto';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(items: CreateOrderItemDto[]) {
    items.forEach(async (item) => {
      const schedule = await this.filmsRepository.findScheduleById(
        item.session,
      );
      const seatStr = `${item.row}:${item.seat}`;
      if (schedule.taken.includes(seatStr)) {
        throw new Error(`Seat ${seatStr} is already taken`);
      }
      schedule.taken.push(seatStr);
      await this.filmsRepository.updateSchedule(schedule);
    });

    return {
      total: items.length,
      items: items.map((item) => ({
        ...item,
        id: '',
      })),
    };
  }
}
