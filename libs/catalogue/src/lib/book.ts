import { ensure, isString, Predicate, TinyTypeOf } from 'tiny-types';
import { Column, Entity } from 'typeorm';
import { BookInstance } from './book-instance';
import { BookType } from './book-type';
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
  @Column({
    type: 'varchar',
    length: 100,
    transformer: {
      to: (value: Author) => value.value,
      from: (value: string) => new Author(value),
    },
  })
  private author!: Author;

  @Column({
    primary: true,
    type: 'varchar',
    length: 100,
    transformer: {
      // "| string" for the findOneBy
      to: (value: ISBN | string) => (value as ISBN).value ?? value,
      from: (value: string) => new ISBN(value),
    },
  })
  private isbn!: ISBN;

  @Column({
    type: 'varchar',
    length: 100,
    transformer: {
      to: (value: Title) => value.value,
      from: (value: string) => new Title(value),
    },
  })
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
