import { PrimaryColumn, Column, Entity } from 'typeorm';
import { BookId } from './book-id';
import { BookType } from './book-type';
import { ISBN } from './isbn';

@Entity()
export class BookInstance {
  @Column({
    type: 'varchar',
    length: 100,
    transformer: {
      to: (value: ISBN) => value.value,
      from: (value: string) => new ISBN(value),
    },
  })
  private isbn!: ISBN;
  @Column({
    type: 'enum',
    enum: BookType,
  })
  private bookType!: BookType;
  @Column({
    primary: true,
    type: 'uuid',
    transformer: {
      to: (value: BookId) => value.value,
      from: (value: string) => new BookId(value),
    },
  })
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
