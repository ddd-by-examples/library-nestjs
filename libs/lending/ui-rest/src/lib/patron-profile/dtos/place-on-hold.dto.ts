import { IsNumber, IsUUID, Min } from 'class-validator';

export class PlaceOnHoldDto {
  @IsUUID()
  bookId!: string;

  @IsNumber()
  @Min(1)
  numberOfDays!: number;
}
