import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AppRepository } from 'src/repository/app.repository';

@Module({
  imports: [AppRepository],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
