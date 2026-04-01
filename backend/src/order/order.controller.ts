import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async createOrder(@Body() order: CreateOrderDto) {
    const result = await this.orderService
      .createOrder(order.tickets)
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    return result;
  }
}
