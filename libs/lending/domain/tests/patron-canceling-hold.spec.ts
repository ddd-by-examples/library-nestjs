import { isRight } from 'fp-ts/Either';
import { BookFixtures } from './book.fixtures';
import { PatronFixtures } from './patron.fixtures';

describe('PatronCancelingHoldTest', () => {
  test('patron should be able to cancel his holds', () => {
    // given
    const forBook = BookFixtures.bookOnHold();
    // and
    const patron = PatronFixtures.regularPatronWithHold(forBook);
    // when
    const cancelHold = patron.cancelHold(forBook);
    // then
    expect(isRight(cancelHold)).toBe(true);
  });

  test('patron cannot cancel not his hold', () => {
    // given
    const forBook = BookFixtures.bookOnHold();
    // and
    const patron = PatronFixtures.GivenRegularPatron();
    // when
    const cancelHold = patron.cancelHold(forBook);
    // then
    expect(isRight(cancelHold)).toBe(false);
  });
});
