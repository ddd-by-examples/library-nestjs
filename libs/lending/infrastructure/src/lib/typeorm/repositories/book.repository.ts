import { FindAvailableBook } from '@library/lending/application';
import { AvailableBook, BookId } from '@library/lending/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { option } from 'fp-ts';
import { Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookRepo implements FindAvailableBook {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>
  ) {}

  async findAvailableBookById(id: BookId): Promise<Option<AvailableBook>> {
    const book = await this.bookRepo.findOne(id.value);
    return pipe(
      option.fromNullable(book),
      option.map((book) => book.toAvailableBook())
    );
  }
}
