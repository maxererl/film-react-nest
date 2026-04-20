import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(items: CreateOrderItemDto[]) {
    const schedulesMap = new Map();
    await Promise.all(
      Array.from(new Set(items.map((i) => i.session))).map(async (s) =>
        schedulesMap.set(s, await this.filmsRepository.findScheduleById(s)),
      ),
    );

    items.forEach((item) => {
      const schedule = schedulesMap.get(item.session);
      const seatStr = `${item.row}:${item.seat}`;
      if (schedule.taken.includes(seatStr)) {
        throw new Error(`Seat ${seatStr} is already taken`);
      }
      schedule.taken.push(seatStr);
    });

    await Promise.all(
      Array.from(schedulesMap.values()).map((schedule) =>
        this.filmsRepository.updateSchedule(schedule),
      ),
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
