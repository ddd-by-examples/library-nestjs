import { PatronId } from '../..';
import { BookPlacedOnHold } from './book-placed-on-hold';
import { MaximumNumberOhHoldsReached } from './maximum-number-on-holds-reached';
import { PatronEvent } from './patron-event';

export class BookPlacedOnHoldEvents implements PatronEvent {
  private constructor(
    public readonly patronId: PatronId,
    public readonly bookPlacedOnHold: BookPlacedOnHold,
    public readonly maximumNumberOhHoldsReached?: MaximumNumberOhHoldsReached
  ) {}
  static event(
    patronId: PatronId,
    bookPlacedOnHold: BookPlacedOnHold
  ): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(patronId, bookPlacedOnHold);
  }
  static events(
    patronId: PatronId,
    bookPlacedOnHold: BookPlacedOnHold,
    maximumNumberOnHoldsReached: MaximumNumberOhHoldsReached
  ): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(
      patronId,
      bookPlacedOnHold,
      maximumNumberOnHoldsReached
    );
  }
}
