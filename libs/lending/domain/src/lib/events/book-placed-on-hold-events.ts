import { BookPlacedOnHold } from './book-placed-on-hold';
import { MaximumNumberOhHoldsReached } from './maximum-number-on-holds-reached';

export class BookPlacedOnHoldEvents {
  private constructor(
    private readonly bookPlacedOnHold: BookPlacedOnHold,
    private readonly maximumNumberOhHoldsReached?: MaximumNumberOhHoldsReached
  ) {}
  static event(bookPlacedOnHold: BookPlacedOnHold): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(bookPlacedOnHold);
  }
  static events(
    bookPlacedOnHold: BookPlacedOnHold,
    maximumNumberOnHoldsReached: MaximumNumberOhHoldsReached
  ): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(
      bookPlacedOnHold,
      maximumNumberOnHoldsReached
    );
  }
}
