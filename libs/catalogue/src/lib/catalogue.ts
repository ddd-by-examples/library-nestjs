import { DomainEvents, Result } from '@library/shared/domain';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { getOrElse, map } from 'fp-ts/Option';
import { Book } from './book';
import { BookInstance } from './book-instance';
import { BookInstanceAddedToCatalogue } from './book-instance-added-to-catalogue';
import { BookType } from './book-type';
import { CatalogueDatabase } from './catalogue-database';
import { UpdateBookDto } from './dto/update-book.dto';
import { ISBN } from './isbn';

@Injectable()
export class Catalogue {
  constructor(
    private readonly database: CatalogueDatabase,
    private readonly domainEvents: DomainEvents
  ) {}
  async addBook(author: string, title: string, isbn: string): Promise<Result> {
    const book = Book.create(isbn, author, title);
    await this.database.saveNewBook(book);
    return Result.Success;
  }

  async addBookInstance(isbn: string, bookType: BookType): Promise<Result> {
    return pipe(
      await this.database.findBookByIsbn(new ISBN(isbn)),
      map((book) => book.toAnInstance(bookType)),
      map(this.saveAndPublishEvents.bind(this)),
      map(() => Result.Success),
      getOrElse<Result>(() => Result.Rejection)
    );
  }

  findAll() {
    return `This action returns all book`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }

  private async saveAndPublishEvents(
    bookInstance: BookInstance
  ): Promise<BookInstance> {
    await this.database.saveNewBookInstance(bookInstance);
    this.domainEvents.publish(
      BookInstanceAddedToCatalogue.fromBookInstance(bookInstance)
    );
    return bookInstance;
  }
}
