import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { BookId } from './book-id';
import { BookType } from './book-type';
import { ISBNType } from './custom-db-types';
import { ISBN } from './isbn';

@Entity()
export class BookInstance {
  @Property({ type: ISBNType })
  private isbn!: ISBN;
  @Enum(() => BookType)
  private bookType!: BookType;
  @PrimaryKey()
  private bookId!: BookId;

  static instanceOf(isbn: ISBN, bookType: BookType): BookInstance {
    const instance = new BookInstance();
    instance.isbn = isbn;
    instance.bookType = bookType;
    instance.bookId = BookId.generate();
    return instance;
  }

  getSnapshot(): BookInstanceSnapshot {
    return { isbn: this.isbn, bookId: this.bookId, bookType: this.bookType };
  }
}

export interface BookInstanceSnapshot {
  isbn: ISBN;
  bookType: BookType;
  bookId: BookId;
}
