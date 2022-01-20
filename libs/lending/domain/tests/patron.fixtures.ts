import { AvailableBook } from '../src/lib/available-book';
import { Patron } from '../src/lib/patron';
import {
  allCurrentPolicies,
  onlyResearcherPatronsCanPlaceOpenEndedHolds,
} from '../src/lib/policies/placing-on-hold-policy';
import { BookId } from '../src/lib/value-objects/book-id';
import { Hold } from '../src/lib/value-objects/hold';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';
import { PatronHolds } from '../src/lib/value-objects/patron-holds';
import { PatronId } from '../src/lib/value-objects/patron-id';
import { PatronInformation } from '../src/lib/value-objects/patron-information';
import { PatronType } from '../src/lib/value-objects/patron-type';

export class PatronFixtures {
  static GivenRegularPatron(patronId?: PatronId): Patron {
    if (!patronId) {
      patronId = PatronId.generate();
    }
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(PatronType.Regular)
    );
  }
  static GivenCirculatingAvailableBook(): AvailableBook {
    return new AvailableBook();
  }
  static GivenResearcherPatron(): Patron {
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(PatronType.Researcher)
    );
  }

  static regularPatronWithHolds(numberOfHold: number): Patron {
    return new Patron(
      new PatronHolds(
        new Set(
          Array(numberOfHold)
            .fill(null)
            .map(() => new Hold(BookId.generate(), LibraryBranchId.generate()))
        )
      ),
      allCurrentPolicies,
      new PatronInformation(PatronType.Regular)
    );
  }
}
