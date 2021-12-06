import { right } from 'fp-ts/Either';
import { Either } from 'fp-ts/lib/Either';
import { AvailableBook } from '../src/lib/book/available-book';
import { BookHoldFailed } from '../src/lib/patron/events/book-hold-failed';
import { BookPlacedOnHold } from '../src/lib/patron/events/book-placed-on-hold';
import { Patron } from '../src/lib/patron/patron';
import { DateVO } from '../src/lib/patron/value-objects/date.vo';
import { HoldDuration } from '../src/lib/patron/value-objects/hold-duration';
import { NumberOfDays } from '../src/lib/patron/value-objects/number-of-days';

const getFixtures = () => {
  jest.useFakeTimers().setSystemTime(new Date('2021-01-01').getTime());
  const regularPatron = new Patron();
  const researcherPatron = new Patron();

  return {
    GivenAnyPantron(): Patron[] {
      return [regularPatron, researcherPatron];
    },
    GivenRegularPatron(): Patron {
      return regularPatron;
    },
    GivenCirculatingAvailableBook(): AvailableBook {
      return new AvailableBook();
    },
    ThenBookShouldBePlacedOnHoldTillDate(
      result: Either<BookHoldFailed, BookPlacedOnHold>
    ): void {
      expect(result).toMatchObject(
        right(new BookPlacedOnHold(DateVO.now().addDays(3)))
      );
    },
    WhenRequestingCloseEndedHold(
      patron: Patron,
      book: AvailableBook,
      duration: HoldDuration
    ): Either<BookHoldFailed, BookPlacedOnHold> {
      return patron.placeOnCloseEndedHold(book, duration);
    },
  };
};

const fixtures = getFixtures();
describe('PatronRequestingCloseEndedHold', () => {
  test('any patron can request close ended hold', () => {
    fixtures.GivenAnyPantron().forEach((patron) => {
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
