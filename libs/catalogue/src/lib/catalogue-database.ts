import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fromNullable } from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { ObjectID, Repository } from 'typeorm';
import { Book } from './book';
import { BookInstance } from './book-instance';
import { ISBN } from './isbn';

@Injectable()
export class CatalogueDatabase {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookInstance)
    private readonly bookInstanceRepository: Repository<BookInstance>
  ) {}
  async findBookByIsbn(isbn: ISBN): Promise<Option<Book>> {
    return fromNullable(await this.bookRepository.findOne(isbn.value));
  }
  async saveNewBook(book: Book): Promise<Book> {
    await this.bookRepository.insert(book);
    return book;
  }
  async saveNewBookInstance(bookInstance: BookInstance) {
    await this.bookInstanceRepository.insert(bookInstance);
    return bookInstance;
  }
}
