import { AvailableBook } from '../src/lib/available-book';

export class PatronFixtures {
  static GivenCirculatingAvailableBook(): AvailableBook {
    return new AvailableBook();
  }
}
