import { Patron } from '../patron';
import { allCurrentPolicies } from '../policies/placing-on-hold-policy';
import { BookId } from '../value-objects/book-id';
import { Hold } from '../value-objects/hold';
import { LibraryBranchId } from '../value-objects/library-branch-id';
import { PatronHolds } from '../value-objects/patron-holds';
import { PatronId } from '../value-objects/patron-id';
import { PatronInformation } from '../value-objects/patron-information';
import { PatronType } from '../value-objects/patron-type';

export class PatronFactory {
  create(
    patronType: PatronType,
    patronId: PatronId,
    patronHolds: Set<[BookId, LibraryBranchId]>
  ): Patron {
    return new Patron(
      new PatronHolds(
        new Set(
          [...patronHolds].map(
            ([bookId, libraryBranchId]) => new Hold(bookId, libraryBranchId)
          )
        )
      ),
      allCurrentPolicies,
      new PatronInformation(patronId, patronType)
    );
  }
}
