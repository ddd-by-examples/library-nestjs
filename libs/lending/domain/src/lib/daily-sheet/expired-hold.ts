import { TinyType } from 'tiny-types';
import { BookHoldExpired } from '../events/book-hold.expired';
import { BookId } from '../value-objects/book-id';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { PatronId } from '../value-objects/patron-id';

export class ExpiredHold extends TinyType {
  constructor(
    private readonly heldBook: BookId,
    private readonly patron: PatronId,
    private readonly library: LibraryBranchId
  ) {
    super();
  }

  toEvent(): BookHoldExpired {
    return BookHoldExpired.now(this.heldBook, this.patron, this.library);
  }
}
