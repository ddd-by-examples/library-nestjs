import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { fromNullable, Option } from 'fp-ts/Option';
import { Repository } from 'typeorm';
import { Book } from './book';
import { BookInstance } from './book-instance';
import { ISBN } from './isbn';

@Injectable()
export class CatalogueDatabase {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
    @InjectRepository(BookInstance)
    private readonly bookInstanceRepository: EntityRepository<BookInstance>
  ) {}
  async findBookByIsbn(isbn: ISBN): Promise<Option<Book>> {
    return fromNullable(await this.bookRepository.findOne(isbn.value));
  }
  async saveNewBook(book: Book): Promise<Book> {
    await this.bookRepository.persistAndFlush(book);
    return book;
  }
  async saveNewBookInstance(bookInstance: BookInstance) {
    await this.bookInstanceRepository.persistAndFlush(bookInstance);
    return bookInstance;
  }
}
