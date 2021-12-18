import { DateVO } from '../value-objects/date.vo';

export class BookPlacedOnHold {
  constructor(public readonly till: DateVO | null) {}
}
