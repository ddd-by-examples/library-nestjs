import { AvailableBook } from '../src/lib/available-book';
import { BookOnHold } from '../src/lib/book-on-hold';
import { BookId } from '../src/lib/value-objects/book-id';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';

export class BookFixtures {
  static bookOnHold() {
    return new BookOnHold(BookId.generate(), LibraryBranchId.generate());
  }

  static circulatingBook(): AvailableBook {
    return new AvailableBook(BookId.generate(), LibraryBranchId.generate());
  }
}
