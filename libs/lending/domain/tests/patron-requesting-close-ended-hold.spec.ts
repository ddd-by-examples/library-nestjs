import { right } from 'fp-ts/Either';
import { Either } from 'fp-ts/lib/Either';
import { AvailableBook } from '../src/lib/available-book';
import { BookHoldFailed } from '../src/lib/events/book-hold-failed';
import { BookPlacedOnHold } from '../src/lib/events/book-placed-on-hold';
import { BookPlacedOnHoldEvents } from '../src/lib/events/book-placed-on-hold-events';
import { Patron } from '../src/lib/patron';
import { DateVO } from '../src/lib/value-objects/date.vo';
import { HoldDuration } from '../src/lib/value-objects/hold-duration';
import { NumberOfDays } from '../src/lib/value-objects/number-of-days';
import { PatronHolds } from '../src/lib/value-objects/patron-holds';
import { PatronFixtures } from './patron.fixtures';

const getFixtures = () => {
  jest.useFakeTimers().setSystemTime(new Date('2021-01-01').getTime());
  const regularPatron = new Patron(new PatronHolds(new Set()));
  const researcherPatron = new Patron(new PatronHolds(new Set()));

  return {
    GivenAnyPatron(): Patron[] {
      return [regularPatron, researcherPatron];
    },
    GivenRegularPatron(): Patron {
      return regularPatron;
    },
    GivenCirculatingAvailableBook: PatronFixtures.GivenCirculatingAvailableBook,
    ThenBookShouldBePlacedOnHoldTillDate(
      result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
    ): void {
      expect(result).toMatchObject(
        right(
          expect.objectContaining({
            bookPlacedOnHold: new BookPlacedOnHold(DateVO.now().addDays(3)),
          })
        )
      );
    },
    WhenRequestingCloseEndedHold(
      patron: Patron,
      book: AvailableBook,
      duration: HoldDuration
    ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
      return patron.placeOnCloseEndedHold(book, duration);
    },
  };
};

const fixtures = getFixtures();
describe('PatronRequestingCloseEndedHold', () => {
  test('any patron can request close ended hold', () => {
    fixtures.GivenAnyPatron().forEach((patron) => {
      const book = fixtures.GivenCirculatingAvailableBook();
      const result = fixtures.WhenRequestingCloseEndedHold(
        patron,
        book,
        HoldDuration.closeEnded(NumberOfDays.of(3))
      );
      fixtures.ThenBookShouldBePlacedOnHoldTillDate(result);
    });
  });

  test('patron cannot hold a book for 0 or negative amount of days', () => {
    for (let days = -10; days <= 0; days++) {
      const test = () => {
        const patron = fixtures.GivenRegularPatron();
        const book = fixtures.GivenCirculatingAvailableBook();
        fixtures.WhenRequestingCloseEndedHold(
          patron,
          book,
          HoldDuration.closeEnded(NumberOfDays.of(days))
        );
      };
      expect(test).toThrow();
    }
  });
});
