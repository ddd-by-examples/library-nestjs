import { Either } from 'fp-ts/lib/Either';
import { AvailableBook } from '../src/lib/available-book';
import { BookHoldFailed } from '../src/lib/events/book-hold-failed';
import { BookPlacedOnHoldEvents } from '../src/lib/events/book-placed-on-hold-events';
import { MaximumNumberOhHoldsReached } from '../src/lib/events/maximum-number-on-holds-reached';
import { Patron } from '../src/lib/patron';
import { BookId } from '../src/lib/value-objects/book-id';
import { Hold } from '../src/lib/value-objects/hold';
import { HoldDuration } from '../src/lib/value-objects/hold-duration';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';
import { NumberOfDays } from '../src/lib/value-objects/number-of-days';
import { PatronHolds } from '../src/lib/value-objects/patron-holds';
import { PatronFixtures } from './patron.fixtures';

class Fixtures {
  static GivenRegularPatronWithLastPossibleHold(): Patron {
    return new Patron(
      new PatronHolds(
        new Set(
          Array(4)
            .fill(null)
            .map(() => new Hold(BookId.generate(), LibraryBranchId.generate()))
        )
      )
    );
  }
  static GivenCirculatingAvailableBook =
    PatronFixtures.GivenCirculatingAvailableBook;
  static ThenAnnounceLasPossibleHold(
    result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
  ) {
    expect(result).toMatchObject(
      expect.objectContaining({
        right: expect.objectContaining({
          maximumNumberOhHoldsReached: new MaximumNumberOhHoldsReached(),
        }),
      })
    );
  }
  static WhenRequestingLastPossibleHold(
    patron: Patron,
    book: AvailableBook
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnCloseEndedHold(
      book,
      HoldDuration.closeEnded(NumberOfDays.of(3))
    );
  }
}

it('should announce that a regular patron places his last possible hold (4th)', async () => {
  const book = Fixtures.GivenCirculatingAvailableBook();
  const patron = Fixtures.GivenRegularPatronWithLastPossibleHold();
  const result = Fixtures.WhenRequestingLastPossibleHold(patron, book);
  Fixtures.ThenAnnounceLasPossibleHold(result);
});
