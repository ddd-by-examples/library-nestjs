import { BookId, PatronId } from '@library/lending/domain';
import { Result } from '@library/shared/domain';
import { option } from 'fp-ts';
import { createSpyObj } from 'jest-createspyobj';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BookFixtures } from 'libs/lending/domain/tests/book.fixtures';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PatronFixtures } from 'libs/lending/domain/tests/patron.fixtures';
import { PatronRepository } from '../ports/patron.repository';
import { CancelHoldCommand } from './cancel-hold.command';
import { CancelHoldHandler } from './cancel-hold.handler';
import { FindBookOnHold } from './find-book-on-hold';

describe('CancelHoldHandler', () => {
  const bookOnHold = BookFixtures.bookOnHold();
  const patronId = PatronId.generate();

  const willFindBook: FindBookOnHold = {
    findBookOnHold: () => Promise.resolve(option.of(bookOnHold)),
  };
  const willNotFindBook: FindBookOnHold = {
    findBookOnHold: () => Promise.resolve(option.none),
  };
  const repository = createSpyObj(PatronRepository, ['findById', 'publish']);

  afterEach(() => {
    repository.publish.mockReset();
  });

  it('should successfully cancel hold if book was placed on hold by patron, and patron and book exist', async () => {
    // given
    const canceling = new CancelHoldHandler(willFindBook, repository);
    // and
    persistedRegularPatronWithBookOnHold();
    // when
    const result: Result = await canceling.execute(cmd());
    // then
    expect(result).toBe(Result.Success);
  });

  it('should reject placing on hold book if one of the domain rules is broken (but should not fail!)', async () => {
    // given
    const canceling = new CancelHoldHandler(willFindBook, repository);
    // and
    persistedRegularPatronWithoutBookOnHold();
    // when
    const result = await canceling.execute(cmd());
    // then
    expect(result).toBe(Result.Rejection);
  });

  it('should fail if patron does not exists', async () => {
    // given
    const canceling = new CancelHoldHandler(willFindBook, repository);
    // and
    unknownPatron();
    // when
    const result = canceling.execute(cmd());
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if book does not exists', async () => {
    // given
    const canceling = new CancelHoldHandler(willNotFindBook, repository);
    // and
    persistedRegularPatronWithBookOnHold();
    // when
    const result = canceling.execute(cmd());
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if saving patron fails', async () => {
    // given
    const canceling = new CancelHoldHandler(willFindBook, repository);
    // and
    persistedRegularPatronThatFailsOnSaving();
    // when
    const result = canceling.execute(cmd());
    // then
    await expect(result).rejects.toThrow();
  });

  function cmd(): CancelHoldCommand {
    return new CancelHoldCommand(patronId, BookId.generate());
  }

  function persistedRegularPatronWithBookOnHold(): PatronId {
    const patron = PatronFixtures.regularPatronWithHold(bookOnHold);
    repository.findById.mockResolvedValueOnce(option.of(patron));
    repository.publish.mockResolvedValueOnce(patron);
    return patronId;
  }

  function persistedRegularPatronWithoutBookOnHold(): PatronId {
    const patron = PatronFixtures.regularPatronWithHolds(10);
    repository.findById.mockResolvedValueOnce(option.of(patron));
    return patronId;
  }

  function persistedRegularPatronThatFailsOnSaving(): PatronId {
    const patron = PatronFixtures.regularPatronWithHold(bookOnHold);
    repository.findById.mockResolvedValueOnce(option.of(patron));
    repository.publish.mockRejectedValueOnce(new Error('Mocked to fail'));
    return patronId;
  }

  function unknownPatron(): PatronId {
    return PatronId.generate();
  }
});
