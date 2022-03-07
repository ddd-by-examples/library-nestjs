import { AvailableBook, BookId } from '@library/lending/domain';
import { LibraryBranchId } from 'libs/lending/domain/src/lib/value-objects/library-branch-id';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  bookId!: string;

  @Column('uuid')
  availableAtBranch!: string;

  getBookId(): BookId {
    return new BookId(this.bookId);
  }

  getLibraryBranchId(): LibraryBranchId {
    return new LibraryBranchId(this.availableAtBranch);
  }

  toAvailableBook(): AvailableBook {
    return new AvailableBook(this.getBookId(), this.getLibraryBranchId());
  }

  static restore(
    data: Omit<Book, 'getBookId' | 'getLibraryBranchId' | 'toAvailableBook'>
  ): Book {
    return Object.assign(new Book(), data);
  }
}
