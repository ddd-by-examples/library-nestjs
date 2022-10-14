import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { getLeft, isNone, none, Option } from 'fp-ts/lib/Option';
import { AvailableBook } from './book/available-book';
import { Book } from './book/book';
import { BookOnHold } from './book/book-on-hold';
import { BookCheckOutFailed } from './events/book-check-out-failed';
import { BookCheckedOut } from './events/book-checked-out';
import { BookHoldCancelingFailed } from './events/book-hold-canceled';
import { BookHoldCanceled } from './events/book-hold-canceling-failed';
import { BookHoldFailed } from './events/book-hold-failed';
import { BookPlacedOnHold } from './events/book-placed-on-hold';
import { BookPlacedOnHoldEvents } from './events/book-placed-on-hold-events';
import { MaximumNumberOhHoldsReached } from './events/maximum-number-on-holds-reached';
import { CheckingOutPolicy } from './policies/checking-out.policy';
import {
  PlacingOnHoldPolicy,
  Rejection,
} from './policies/placing-on-hold-policy';
import { HoldDuration } from './value-objects/hold-duration';
import { PatronHolds } from './value-objects/patron-holds';
import { PatronInformation } from './value-objects/patron-information';

export class Patron {
  constructor(
    private readonly checkingOutPolicies: Set<CheckingOutPolicy>,
    private readonly patronHolds: PatronHolds,
    private readonly placingOnHoldPolicies: Set<PlacingOnHoldPolicy>,
    private readonly patronInformation: PatronInformation
  ) {}

  cancelHold(
    book: BookOnHold
  ): Either<BookHoldCancelingFailed, BookHoldCanceled> {
    if (this.patronHolds.includes(book)) {
      return right(
        new BookHoldCanceled(
          this.patronInformation.patronId,
          book.bookId,
          book.libraryBranchId
        )
      );
    }
    return left(new BookHoldCancelingFailed(this.patronInformation.patronId));
  }

  checkoutBook(
    book: Book
  ): Either<BookCheckOutFailed, BookCheckedOut> {
    const rejection = this.patronCanCheckout(book);

    if (!isNone(rejection)) {
      return left(
        BookCheckOutFailed.bookCheckOutFailedBecause(
          rejection.value,
          this.patronInformation.patronId
        )
      );
    }

    return right(new BookCheckedOut(this.patronInformation.patronId));
  }

  private patronCanCheckout(book: Book): Option<Rejection> {
    const rejection = [...this.checkingOutPolicies]
      .map((policy) => policy(book, this.patronInformation.patronId))
      .find(isLeft);
    return rejection ? getLeft(rejection) : none;
  }

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
            this.patronInformation.patronId,
            new BookPlacedOnHold(
              this.patronInformation.patronId,
              book.bookId,
              book.libraryBranchId,
              duration.to
            ),
            new MaximumNumberOhHoldsReached()
          )
        );
      }
      return right(
        BookPlacedOnHoldEvents.event(
          this.patronInformation.patronId,
          new BookPlacedOnHold(
            this.patronInformation.patronId,
            book.bookId,
            book.libraryBranchId,
            duration.to
          )
        )
      );
    }
    return left(
      BookHoldFailed.bookHoldFailedNow(
        rejection.value,
        this.patronInformation.patronId
      )
    );
  }
}
