import { Hold } from './hold';

export class PatronHolds {
  static MAX_NUMBER_OF_HOLDS = 5;
  constructor(public readonly resourcesOnHold: Set<Hold>) {}
  maximumHoldsAfterHoldingNextBook(): boolean {
    return this.resourcesOnHold.size + 1 === PatronHolds.MAX_NUMBER_OF_HOLDS;
  }
}
