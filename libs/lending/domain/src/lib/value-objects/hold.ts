import { TinyType } from 'tiny-types';
import { BookId } from './book-id';

export class Hold extends TinyType {
  constructor(private readonly bookId: BookId) {
    super();
  }

  forBook(bookId: BookId): boolean {
    return bookId.equals(this.bookId);
  }
}
