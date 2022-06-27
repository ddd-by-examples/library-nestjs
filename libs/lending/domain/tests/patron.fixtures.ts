import { Version } from '@library/shared/domain';
import { AvailableBook } from '../src/lib/book/available-book';
import { BookOnHold } from '../src/lib/book/book-on-hold';
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
  static regularPatronWithHold(bookOnHold: BookOnHold): Patron {
    return new Patron(
      new PatronHolds(
        new Set([new Hold(bookOnHold.bookId, bookOnHold.libraryBranchId)])
      ),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(PatronId.generate(), PatronType.Researcher)
    );
  }
  static GivenRegularPatron(patronId?: PatronId): Patron {
    if (!patronId) {
      patronId = PatronId.generate();
    }
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(patronId, PatronType.Regular)
    );
  }
  static GivenCirculatingAvailableBook(): AvailableBook {
    return new AvailableBook(
      BookId.generate(),
      LibraryBranchId.generate(),
      Version.zero()
    );
  }
  static GivenResearcherPatron(): Patron {
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(PatronId.generate(), PatronType.Researcher)
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
      new PatronInformation(PatronId.generate(), PatronType.Regular)
    );
  }
}
