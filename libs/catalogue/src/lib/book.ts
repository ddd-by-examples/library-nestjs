import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ensure, isString, Predicate, TinyTypeOf } from 'tiny-types';
import { BookInstance } from './book-instance';
import { BookType } from './book-type';
import { AuthorType, ISBNType, TitleType } from './custom-db-types';
import { ISBN } from './isbn';

export class Title extends TinyTypeOf<string>() {
  constructor(title: string) {
    super(title);
    ensure(
      'Title',
      title,
      isString(),
      Predicate.to('not be empty', (value) => value !== '')
    );
  }
}

export class Author extends TinyTypeOf<string>() {
  constructor(author: string) {
    super(author);
    ensure(
      'Author',
      author,
      isString(),
      Predicate.to('not be empty', (value) => value !== '')
    );
  }
}

@Entity()
export class Book {
  @Property({ type: AuthorType })
  private author!: Author;

  @PrimaryKey({ type: ISBNType })
  private isbn!: ISBN;

  @Property({ type: TitleType })
  private title!: Title;
  static create(isbn: string, author: string, title: string): Book {
    const book = new Book();
    book.isbn = new ISBN(isbn);
    book.title = new Title(title);
    book.author = new Author(author);
    return book;
  }

  toAnInstance(bookType: BookType): BookInstance {
    return BookInstance.instanceOf(this.isbn, bookType);
  }
}
