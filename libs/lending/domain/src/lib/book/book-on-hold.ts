import { Version } from '@library/shared/domain';
import { BookHoldCanceled } from '../events/book-hold-canceling-failed';
import { BookId } from '../value-objects/book-id';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { PatronId } from '../value-objects/patron-id';
import { AvailableBook } from './available-book';
import { Book } from './book';

export class BookOnHold implements Book {
  constructor(
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId,
    public readonly patronId: PatronId,
    public readonly version: Version
  ) {}

  by(patronId: PatronId): boolean {
    return this.patronId.equals(patronId);
  }

  handleHoldCanceled(holdCanceled: BookHoldCanceled): AvailableBook {
    return new AvailableBook(
      this.bookId,
      holdCanceled.libraryBranchId,
      this.version
    );
  }
}
