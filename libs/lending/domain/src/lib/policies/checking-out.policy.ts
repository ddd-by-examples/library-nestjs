import { Either, left, right } from 'fp-ts/Either';
import { Book } from '../book/book';
import { BookOnHold } from '../book/book-on-hold';
import { PatronId } from '../value-objects/patron-id';

export interface CheckingOutPolicy {
  (book: Book, patronId: PatronId): Either<Rejection, Allowance>;
}

export const bookIsOnHold: CheckingOutPolicy = (
  toCheckout: Book,
  _: PatronId
) => {
  if (!(toCheckout instanceof BookOnHold)) {
    return left(
      Rejection.withReason(
        'Cannot checkout book which is not on hold'
      )
    );
  }
  return right(new Allowance());
};

export const bookIsOnHoldByThePatron: CheckingOutPolicy = (
  toCheckout: Book,
  patronId: PatronId
) => {
  if (toCheckout instanceof BookOnHold && !toCheckout.by(patronId)) {
    return left(
      Rejection.withReason(
        'Cannot checkout book which is on hold by different patron'
      )
    );
  }
  return right(new Allowance());
};

export const allCheckingOutPolicies: Set<CheckingOutPolicy> = new Set([
  bookIsOnHold,
  bookIsOnHoldByThePatron,
]);

export class Allowance {}

export class Rejection {
  private constructor(public readonly reason: string) {}

  static withReason(reason: string): Rejection {
    return new Rejection(reason);
  }
}
