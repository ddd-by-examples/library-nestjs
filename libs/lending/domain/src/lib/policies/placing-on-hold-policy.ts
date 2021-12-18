import { Either, left, right } from 'fp-ts/lib/Either';
import { AvailableBook } from '../available-book';
import { Patron } from '../patron';
import { HoldDuration } from '../value-objects/hold-duration';

export interface PlacingOnHoldPolicy {
  (book: AvailableBook, patron: Patron, duration: HoldDuration): Either<
    Rejection,
    Allowance
  >;
}

export const onlyResearcherPatronsCanPlaceOpenEndedHolds: PlacingOnHoldPolicy =
  (toHold: AvailableBook, patron: Patron, holdDuration: HoldDuration) => {
    if (patron.isRegular() && holdDuration.isOpenEnded()) {
      return left(
        Rejection.withReason('regular patron cannot place open ended holds')
      );
    }
    return right(new Allowance());
  };

export class Allowance {}

export class Rejection {
  private constructor(public readonly reason: string) {}

  static withReason(reason: string): Rejection {
    return new Rejection(reason);
  }
}
