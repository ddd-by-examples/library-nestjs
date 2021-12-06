import { Either, right } from 'fp-ts/lib/Either';
import { AvailableBook } from '../book/available-book';
import { BookHoldFailed } from './events/book-hold-failed';
import { BookPlacedOnHold } from './events/book-placed-on-hold';
import { HoldDuration } from './value-objects/hold-duration';

export class Patron {
  placeOnCloseEndedHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHold> {
    return right(new BookPlacedOnHold(duration.to));
  }
}
