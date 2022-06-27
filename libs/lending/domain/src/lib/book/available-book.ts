import { Version } from '@library/shared/domain';
import { BookPlacedOnHold } from '../events/book-placed-on-hold';
import { BookId } from '../value-objects/book-id';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { Book } from './book';
import { BookOnHold } from './book-on-hold';

export class AvailableBook implements Book {
  constructor(
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId,
    public readonly version: Version
  ) {}

  handleBookPlacedOnHold(bookPlacedOnHold: BookPlacedOnHold): BookOnHold {
    return new BookOnHold(
      this.bookId,
      this.libraryBranchId,
      bookPlacedOnHold.patronId,
      this.version
    );
  }
}
