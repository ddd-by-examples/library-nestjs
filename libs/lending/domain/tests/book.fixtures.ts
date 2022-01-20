import { AvailableBook } from '../src';

export class BookFixtures {
  static circulatingBook(): AvailableBook {
    return new AvailableBook();
  }
}
