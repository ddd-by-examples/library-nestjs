import { Version } from '@library/shared/domain';
import { PatronId } from '../src';
import { AvailableBook } from '../src/lib/book/available-book';
import { BookOnHold } from '../src/lib/book/book-on-hold';
import { BookId } from '../src/lib/value-objects/book-id';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';

export class BookFixtures {
  static bookOnHold() {
    return new BookOnHold(
      BookId.generate(),
      LibraryBranchId.generate(),
      PatronId.generate(),
      new Version(1)
    );
  }

  static circulatingBook(): AvailableBook {
    return new AvailableBook(
      BookId.generate(),
      LibraryBranchId.generate(),
      Version.zero()
    );
  }
}
