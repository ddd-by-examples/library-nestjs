import { Uuid } from '@library/shared/domain';
import { BookId } from '../value-objects/book-id';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookHoldExpired implements PatronEvent {
  public readonly eventId = Uuid.generate().value;

  private constructor(
    public readonly when: Date,
    public readonly patronId: PatronId,
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId
  ) {}

  public static now(
    bookId: BookId,
    patronId: PatronId,
    libraryBranchId: LibraryBranchId
  ): BookHoldExpired {
    return new BookHoldExpired(new Date(), patronId, bookId, libraryBranchId);
  }
}
