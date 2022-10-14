import { PatronId } from '../value-objects/patron-id';
import { Rejection } from '../policies/placing-on-hold-policy';
import { PatronEvent } from './patron-event';

export class BookCheckOutFailed implements PatronEvent {
  private constructor(
    public readonly reason: string,
    public readonly patronId: PatronId
  ) {}

  static bookCheckOutFailedBecause(
    rejection: Rejection,
    patronId: PatronId
  ): BookCheckOutFailed {
    return new BookCheckOutFailed(rejection.reason, patronId);
  }
}
