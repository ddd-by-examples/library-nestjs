import { BookId } from '../value-objects/book-id';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookHoldCanceled implements PatronEvent {
  constructor(
    public readonly patronId: PatronId,
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId
  ) {}
}
