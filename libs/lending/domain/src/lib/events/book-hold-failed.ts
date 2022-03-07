import { PatronId } from '../..';
import { PatronEvent } from './patron-event';

export class BookHoldFailed implements PatronEvent {
  constructor(public readonly patronId: PatronId) {}
}
