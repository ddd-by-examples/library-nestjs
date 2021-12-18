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
import { PatronFixtures } from './patron.fixtures';

class Fixtures {
  private constructor() {}
  static init(): Fixtures {
    jest.useFakeTimers().setSystemTime(new Date('2021-01-01').getTime());
    return new Fixtures();
  }
  GivenAnyPatron(): Patron[] {
    return [
      PatronFixtures.GivenRegularPatron(),
      PatronFixtures.GivenResearcherPatron(),
    ];
  }
  GivenCirculatingAvailableBook =
    PatronFixtures.GivenCirculatingAvailableBook.bind(this);
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
  }
  WhenRequestingCloseEndedHold(
    patron: Patron,
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnCloseEndedHold(book, duration);
  }
}

describe('PatronRequestingCloseEndedHold', () => {
  const fixtures = Fixtures.init();
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
        const patron = PatronFixtures.GivenRegularPatron();
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
