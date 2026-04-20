import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { randomUUID as uuid } from 'crypto';
import { CreateOrderItemDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        createOrder: jest.fn((items: CreateOrderItemDto[]) =>
          Promise.resolve([
            {
              total: items.length,
              items: items.map((i) => ({ id: uuid(), ...i })),
            },
          ]),
        ),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('.createOrder should call createOrder method of the service', async () => {
    const order = {
      email: 'email@mail.com',
      phone: '+79999999999',
      tickets: [
        {
          film: uuid(),
          session: uuid(),
          daytime: new Date().toISOString(),
          row: 1,
          seat: 1,
          price: 100,
        },
      ],
    };
    await controller.createOrder(order);
    expect(service.createOrder).toHaveBeenCalledWith(order.tickets);
  });
});
