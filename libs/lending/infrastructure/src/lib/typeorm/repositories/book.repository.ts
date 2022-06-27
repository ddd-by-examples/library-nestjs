import {
  BookRepository,
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
import { AggregateRootIsStale } from '@library/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { match, none, Option, some } from 'fp-ts/Option';
import { Repository } from 'typeorm';
import { BookEntity, BookState } from '../entities/book.entity';

@Injectable()
export class BookRepo
  implements FindAvailableBook, FindBookOnHold, BookRepository
{
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

  async save(book: Book): Promise<void> {
    const maybeBook = await this.findById(book.bookId);
    const result = await pipe(
      maybeBook,
      option.match(
        () => this.inserNew(book),
        () => this.updateOptimistically(book)
      )
    );

    if (result === 0) {
      throw new AggregateRootIsStale(
        'Someone has updated book in the meantime, book: ' + book
      );
    }

    return result;
  }

  inserNew(book: Book): Promise<void> {
    switch (book.constructor) {
      case AvailableBook:
        return this.insertAvailableBook(book as AvailableBook);
      case BookOnHold:
        return this.insertBookOnHold(book as BookOnHold);
      default:
        throw new Error(`Can't insert book of the unknown type`);
    }
  }

  async insertAvailableBook(book: AvailableBook): Promise<void> {
    await this.bookRepo.insert(
      BookEntity.restore({
        bookId: book.bookId.value,
        state: BookState.Available,
        availableAtBranch: book.libraryBranchId.value,
        onHoldAtBranch: null,
        onHoldByPatron: null,
        version: 0,
      })
    );
  }

  async insertBookOnHold(book: BookOnHold): Promise<void> {
    await this.bookRepo.insert(
      BookEntity.restore({
        bookId: book.bookId.value,
        state: BookState.OnHold,
        availableAtBranch: null,
        onHoldAtBranch: book.libraryBranchId.value,
        onHoldByPatron: book.patronId.value,
        version: 0,
      })
    );
  }

  updateOptimistically(book: Book): any {
    switch (book.constructor) {
      case AvailableBook:
        return this.updateAvailableBook(book as AvailableBook);
      case BookOnHold:
        return this.updateBookOnHold(book as BookOnHold);
      default:
        throw new Error(`Can't insert book of the unknown type`);
    }
  }

  async updateAvailableBook(book: AvailableBook): Promise<void> {
    await this.bookRepo.update(
      { bookId: book.bookId.value, version: book.version.value },
      BookEntity.restore({
        bookId: book.bookId.value,
        state: BookState.Available,
        availableAtBranch: book.libraryBranchId.value,
        onHoldAtBranch: null,
        onHoldByPatron: null,
        version: book.version.value + 1,
      })
    );
  }

  async updateBookOnHold(book: BookOnHold): Promise<void> {
    await this.bookRepo.update(
      { bookId: book.bookId.value, version: book.version.value },
      BookEntity.restore({
        bookId: book.bookId.value,
        state: BookState.OnHold,
        availableAtBranch: null,
        onHoldAtBranch: book.libraryBranchId.value,
        onHoldByPatron: book.patronId.value,
        version: book.version.value + 1,
      })
    );
  }
}
