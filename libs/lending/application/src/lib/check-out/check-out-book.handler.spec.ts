import { BookId, BookOnHold, PatronId } from '@library/lending/domain';
import { Result } from '@library/shared/domain';
import { none, some } from 'fp-ts/Option';
import { createSpyObj } from 'jest-createspyobj';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BookFixtures } from '../../../../domain/tests/book.fixtures';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PatronFixtures } from '../../../../domain/tests/patron.fixtures';
import { FindBookOnHold } from '../cancel-hold/find-book-on-hold';
import { PatronRepository } from '../ports/patron.repository';
import { CheckOutBookCommand } from './check-out-book.command';
import { CheckOutBookHandler } from './check-out-book.handler';

describe('CheckOutBookHandler', () => {
  const bookOnHold = BookFixtures.bookOnHold();

  const willFindBook: FindBookOnHold = {
    findBookOnHold: () => Promise.resolve(some(bookOnHold)),
  };
  const willNotFindBook: FindBookOnHold = {
    findBookOnHold: () => Promise.resolve(none),
  };
  const patronRepository: jest.Mocked<PatronRepository> = createSpyObj(
    PatronRepository,
    ['findById', 'publish']
  );

  it('should successfully check out book if patron and book exist', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(willFindBook, patronRepository);
    // and
    const patronId = persistedRegularPatronWithHold(
      patronRepository,
      bookOnHold
    );
    // when
    const result = await checkingOut.execute(
      new CheckOutBookCommand(patronId, bookOnHold.bookId)
    );
    // then
    expect(result).toBe(Result.Success);
  });

  it('should reject checking out book if one of the domain rules is broken (but should not fail!)', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(willFindBook, patronRepository);
    // and
    const patronId = persistedRegularPatronWithoutHold(patronRepository);
    // when
    const result = await checkingOut.execute(
      new CheckOutBookCommand(patronId, bookOnHold.bookId)
    );
    // then
    expect(result).toBe(Result.Rejection);
  });

  it('should fail if patron does not exists', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(willFindBook, patronRepository);
    // and
    const patron = unknownPatron(patronRepository);
    // when
    const result = checkingOut.execute(
      new CheckOutBookCommand(patron, bookOnHold.bookId)
    );
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if book does not exists', async () => {
    // given
    const checkingOut = new CheckOutBookHandler(
      willNotFindBook,
      patronRepository
    );
    // and
    const patron = persistedRegularPatron(patronRepository);
    // when
    const result = checkingOut.execute(
      new CheckOutBookCommand(patron, BookId.generate())
    );
    // then
    await expect(result).rejects.toThrow();
  });
});

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
