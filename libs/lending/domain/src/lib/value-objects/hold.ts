import { TinyType } from 'tiny-types';
import { BookId } from './book-id';
import { LibraryBranchId } from './library-branch-id';

export class Hold extends TinyType {
  constructor(
    private readonly bookId: BookId,
    private readonly libraryBranchId: LibraryBranchId
  ) {
    super();
  }

  forBook(bookId: BookId): boolean {
    return bookId.equals(this.bookId);
  }
}
