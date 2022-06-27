import { Rejection } from '../policies/placing-on-hold-policy';
import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookHoldFailed implements PatronEvent {
  constructor(
    public readonly reason: string,
    public readonly patronId: PatronId
  ) {}

  static bookHoldFailedNow(
    rejection: Rejection,
    patronId: PatronId
  ): BookHoldFailed {
    return new BookHoldFailed(rejection.reason, patronId);
  }
}
