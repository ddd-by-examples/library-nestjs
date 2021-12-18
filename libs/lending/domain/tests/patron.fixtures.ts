import { AvailableBook } from '../src/lib/available-book';
import { Patron } from '../src/lib/patron';
import { onlyResearcherPatronsCanPlaceOpenEndedHolds } from '../src/lib/policies/placing-on-hold-policy';
import { PatronHolds } from '../src/lib/value-objects/patron-holds';
import { PatronInformation } from '../src/lib/value-objects/patron-information';
import { PatronType } from '../src/lib/value-objects/patron-type';

export class PatronFixtures {
  static GivenRegularPatron() {
    return new Patron(
      new PatronHolds(new Set()),
      [onlyResearcherPatronsCanPlaceOpenEndedHolds],
      new PatronInformation(PatronType.Regular)
    );
  }
  static GivenCirculatingAvailableBook(): AvailableBook {
    return new AvailableBook();
  }
  static GivenResearcherPatron(): Patron {
    return new Patron(
      new PatronHolds(new Set()),
      [onlyResearcherPatronsCanPlaceOpenEndedHolds],
      new PatronInformation(PatronType.Researcher)
    );
  }
}
