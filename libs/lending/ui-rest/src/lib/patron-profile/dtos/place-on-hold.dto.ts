import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class PlaceOnHoldDto {
  @IsUUID()
  bookId!: string;

  @IsNumber()
  @Min(1)
  numberOfDays!: number;
}
