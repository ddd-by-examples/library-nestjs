import {
  FindAvailableBook,
  FindBookOnHold,
} from '@library/lending/application';
import {
  AvailableBook,
  Book,
  BookId,
  BookOnHold,
  PatronId,
} from '@library/lending/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { match, none, Option, some } from 'fp-ts/Option';
import { Repository } from 'typeorm';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class BookRepo implements FindAvailableBook, FindBookOnHold {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>
  ) {}

  async findById(id: BookId): Promise<Option<Book>> {
    return pipe(
      option.fromNullable(await this.bookRepo.findOne(id.value)),
      option.map((book) => book.toDomainModel())
    );
  }

  async findBookOnHold(
    bookId: BookId,
    patronId: PatronId
  ): Promise<option.Option<BookOnHold>> {
    const maybeBook = await this.findById(bookId);
    return pipe(
      maybeBook,
      match(
        () => none,
        (book) => {
          if (book instanceof BookOnHold) {
            return some(book);
          }
          return none;
        }
      )
    );
  }

  async findAvailableBookById(id: BookId): Promise<Option<AvailableBook>> {
    const maybeBook = await this.findById(id);
    return pipe(
      maybeBook,
      match(
        () => none,
        (book) => {
          if (book instanceof AvailableBook) {
            return some(book);
          }
          return none;
        }
      )
    );
  }
}
