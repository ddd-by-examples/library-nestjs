import { Version } from '@library/shared/domain';
import { PatronId } from '../src';
import { AvailableBook } from '../src/lib/book/available-book';
import { BookOnHold } from '../src/lib/book/book-on-hold';
import { BookId } from '../src/lib/value-objects/book-id';
import { LibraryBranchId } from '../src/lib/value-objects/library-branch-id';

export class BookFixtures {
  static bookOnHold(): BookOnHold {
    return new BookOnHold(
      BookId.generate(),
      LibraryBranchId.generate(),
      PatronId.generate(),
      new Version(1)
    );
  }

  static circulatingBook(): AvailableBook {
    return new AvailableBook(
      BookId.generate(),
      LibraryBranchId.generate(),
      Version.zero()
    );
  }
}

export class BookBuilder {
  private id?: BookId;
  private libraryBranchId?: LibraryBranchId;
  private patronId?: PatronId;
  private version?: Version;

  withId(id: BookId): BookBuilder {
    this.id = id;
    return this;
  }

  withLibraryBranchId(libraryBranchId: LibraryBranchId): BookBuilder {
    this.libraryBranchId = libraryBranchId;
    return this;
  }

  withPatronId(patronId: PatronId): BookBuilder {
    this.patronId = patronId;
    return this;
  }

  withVersion(version: Version): BookBuilder {
    this.version = version;
    return this;
  }

  buildCirculatingBook(): AvailableBook {
    return new AvailableBook(
      this.id ?? BookId.generate(),
      this.libraryBranchId ?? LibraryBranchId.generate(),
      this.version ?? Version.zero()
    );
  }
}
