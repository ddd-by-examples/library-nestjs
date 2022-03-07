import { AvailableBook } from '../src/lib/available-book';
import { BookId } from '../src/lib/value-objects/book-id';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';

export class BookFixtures {
  static circulatingBook(): AvailableBook {
    return new AvailableBook(BookId.generate(), LibraryBranchId.generate());
  }
}
