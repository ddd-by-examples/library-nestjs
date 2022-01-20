import { number } from 'fp-ts';
import { Either, isLeft, right, left } from 'fp-ts/lib/Either';
import { Option, getLeft, none, isNone } from 'fp-ts/lib/Option';
import { AvailableBook } from './available-book';
import { BookHoldFailed } from './events/book-hold-failed';
import { BookPlacedOnHold } from './events/book-placed-on-hold';
import { BookPlacedOnHoldEvents } from './events/book-placed-on-hold-events';
import { MaximumNumberOhHoldsReached } from './events/maximum-number-on-holds-reached';
import {
  PlacingOnHoldPolicy,
  Rejection,
} from './policies/placing-on-hold-policy';
import { HoldDuration } from './value-objects/hold-duration';
import { PatronHolds } from './value-objects/patron-holds';
import { PatronInformation } from './value-objects/patron-information';

export class Patron {
  constructor(
    private readonly patronHolds: PatronHolds,
    private readonly placingOnHoldPolicies: Set<PlacingOnHoldPolicy>,
    private readonly patronInformation: PatronInformation
  ) {}
  isRegular(): boolean {
    return this.patronInformation.isRegular();
  }

  placeOnCloseEndedHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return this.placeOnHold(book, duration);
  }

  placeOnOpenEndedHold(
    book: AvailableBook
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return this.placeOnCloseEndedHold(book, HoldDuration.openEnded());
  }

  numberOfHolds(): number {
    return this.patronHolds.numberOfHolds;
  }
  private patronCanHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Option<Rejection> {
    const rejection = [...this.placingOnHoldPolicies]
      .map((policy) => policy(book, this, duration))
      .find(isLeft);
    return rejection ? getLeft(rejection) : none;
  }

  placeOnHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    const rejection = this.patronCanHold(book, duration);
    if (isNone(rejection)) {
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
    return left(new BookHoldFailed());
  }
}
