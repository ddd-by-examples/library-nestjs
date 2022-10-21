import { BookId, BookOnHold, PatronId } from '@library/lending/domain';
import { Result } from '@library/shared/domain';
import { none, some } from 'fp-ts/Option';
import { createSpyObj } from 'jest-createspyobj';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BookFixtures } from '../../../../domain/tests/book.fixtures';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PatronFixtures } from '../../../../domain/tests/patron.fixtures';
import { BookRepository } from '../ports/book.repository';
import { PatronRepository } from '../ports/patron.repository';
import { CheckOutBookCommand } from './check-out-book.command';
import { CheckOutBookHandler } from './check-out-book.handler';

describe('CheckOutBookHandler', () => {
  const bookRepository = createSpyObj(BookRepository, ['findById', 'save']);
  const patronRepository = createSpyObj(PatronRepository, [
    'findById',
    'publish',
  ]);

  it('should successfully check out book if patron and book exist', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(
      bookRepository,
      patronRepository
    );
    // and
    const book = persistedOnHoldBook(bookRepository);
    // and
    const patron = persistedRegularPatronWithHold(patronRepository, book);
    // when
    const result = await checkingOut.execute(
      new CheckOutBookCommand(patron, book.bookId)
    );
    // then
    expect(result).toBe(Result.Success);
  });

  it('should reject checking out book if one of the domain rules is broken (but should not fail!)', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(
      bookRepository,
      patronRepository
    );
    // and
    const patron = persistedRegularPatronWithoutHold(patronRepository);
    //and
    const book = persistedOnHoldBook(bookRepository);
    // when
    const result = await checkingOut.execute(
      new CheckOutBookCommand(patron, book.bookId)
    );
    // then
    expect(result).toBe(Result.Rejection);
  });

  it('should fail if patron does not exists', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(
      bookRepository,
      patronRepository
    );
    // and
    const patron = unknownPatron(patronRepository);
    // and
    const book = persistedOnHoldBook(bookRepository);
    // when
    const result = checkingOut.execute(
      new CheckOutBookCommand(patron, book.bookId)
    );
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if book does not exists', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(
      bookRepository,
      patronRepository
    );
    // and
    const notExistingBook = unknownBook(bookRepository);
    // and
    const patron = persistedRegularPatron(patronRepository);
    // when
    const result = checkingOut.execute(
      new CheckOutBookCommand(patron, notExistingBook)
    );
    // then
    await expect(result).rejects.toThrow();
  });
});

function persistedOnHoldBook(
  repository: jest.Mocked<BookRepository>
): BookOnHold {
  const book = BookFixtures.bookOnHold();
  repository.findById.mockResolvedValueOnce(some(book));
  return book;
}

function unknownBook(repository: jest.Mocked<BookRepository>): BookId {
  repository.findById.mockResolvedValueOnce(none);
  return BookId.generate();
}

function unknownPatron(repository: jest.Mocked<PatronRepository>): PatronId {
  repository.findById.mockResolvedValueOnce(none);
  return PatronId.generate();
}

function persistedRegularPatron(
  repository: jest.Mocked<PatronRepository>
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.GivenRegularPatron(patronId);
  repository.findById.mockResolvedValueOnce(some(patron));
  return patronId;
}

function persistedRegularPatronWithHold(
  repository: jest.Mocked<PatronRepository>,
  bookOnHold: BookOnHold
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.regularPatronWithHold(bookOnHold, patronId);
  repository.findById.mockResolvedValueOnce(some(patron));
  return patronId;
}

function persistedRegularPatronWithoutHold(
  repository: jest.Mocked<PatronRepository>
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.regularPatronWithHolds(0);
  repository.findById.mockResolvedValueOnce(some(patron));
  return patronId;
}
