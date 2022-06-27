import { Either, right } from 'fp-ts/lib/Either';
import { AvailableBook } from '../src/lib/book/available-book';
import { BookHoldFailed } from '../src/lib/events/book-hold-failed';
import { BookPlacedOnHold } from '../src/lib/events/book-placed-on-hold';
import { BookPlacedOnHoldEvents } from '../src/lib/events/book-placed-on-hold-events';
import { Patron } from '../src/lib/patron';
import { PatronFixtures } from './patron.fixtures';

class Fixtures {
  ThenCantDoThis(result: Either<BookHoldFailed, BookPlacedOnHoldEvents>) {
    expect(result).toMatchObject({ _tag: 'Left' }); // @ToDo
  }
  ThenTheBookIsOnHold(
    result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
  ): void {
    expect(result).toMatchObject(
      right(
        expect.objectContaining({
          bookPlacedOnHold: expect.any(BookPlacedOnHold),
        })
      )
    );
  }
  WhenRequestOpenEndedHold(
    patron: Patron,
    book: AvailableBook
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnOpenEndedHold(book);
  }
}
describe('PatronRequestingOpenEndedHold', () => {
  const fixtures = new Fixtures();
  it('researcher patron can request close ended hold', () => {
    const book = PatronFixtures.GivenCirculatingAvailableBook();
    const researcherPatron = PatronFixtures.GivenResearcherPatron();
    const result = fixtures.WhenRequestOpenEndedHold(researcherPatron, book);
    fixtures.ThenTheBookIsOnHold(result);
  });

  it('regular patron cannot request open ended hold', () => {
    const book = PatronFixtures.GivenCirculatingAvailableBook();
    const regularPatron = PatronFixtures.GivenRegularPatron();
    const result = fixtures.WhenRequestOpenEndedHold(regularPatron, book);
    fixtures.ThenCantDoThis(result);
  });
});
