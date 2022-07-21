import { IsString, IsEnum } from 'class-validator';
import { BookType } from '../book-type';

export class CreateBookDto {
  @IsString()
  author!: string;
  @IsString()
  title!: string;
  @IsString()
  isbn!: string;
  @IsEnum(BookType)
  bookType!: BookType;
}
