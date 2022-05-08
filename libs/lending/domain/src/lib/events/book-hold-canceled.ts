import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookHoldCancelingFailed implements PatronEvent {
  constructor(public readonly patronId: PatronId) {}
}
