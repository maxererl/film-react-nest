import {
  IsUUID,
  IsDateString,
  IsInt,
  IsNumber,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  tickets: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsDateString()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsNumber()
  price: number;
}
