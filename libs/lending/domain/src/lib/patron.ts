import { Either, right } from 'fp-ts/lib/Either';
import { AvailableBook } from './available-book';
import { BookHoldFailed } from './events/book-hold-failed';
import { BookPlacedOnHold } from './events/book-placed-on-hold';
import { BookPlacedOnHoldEvents } from './events/book-placed-on-hold-events';
import { MaximumNumberOhHoldsReached } from './events/maximum-number-on-holds-reached';
import { HoldDuration } from './value-objects/hold-duration';
import { PatronHolds } from './value-objects/patron-holds';

export class Patron {
  constructor(private readonly patronHolds: PatronHolds) {}

  placeOnCloseEndedHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    if (this.patronHolds.maximumHoldsAfterHoldingNextBook()) {
      return right(
        BookPlacedOnHoldEvents.events(
          new BookPlacedOnHold(duration.to),
          new MaximumNumberOhHoldsReached()
        )
      );
    }
    return right(
      BookPlacedOnHoldEvents.event(new BookPlacedOnHold(duration.to))
    );
  }
}
