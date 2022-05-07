import { BookId } from './value-objects/book-id';
import { LibraryBranchId } from './value-objects/library-branch-id';

export class BookOnHold {
  constructor(
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId
  ) {}
}
