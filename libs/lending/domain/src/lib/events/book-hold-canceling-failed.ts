import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookHoldCanceled implements PatronEvent {
  constructor(public readonly patronId: PatronId) {}
}
