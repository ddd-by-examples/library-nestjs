import {
  AvailableBook,
  BookId,
  LibraryBranchId,
} from '@library/lending/domain';
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
