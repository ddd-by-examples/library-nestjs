import { PatronId } from '../value-objects/patron-id';
import { PatronEvent } from './patron-event';

export class BookCheckedOut implements PatronEvent {
  constructor(public readonly patronId: PatronId) {}
}
