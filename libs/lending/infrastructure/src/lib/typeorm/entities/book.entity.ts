import {
  AvailableBook,
  Book,
  BookId,
  BookOnHold,
  LibraryBranchId,
} from '@library/lending/domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum BookState {
  Available,
  OnHold,
}
@Entity()
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  bookId!: string;

  @Column('uuid', { nullable: true })
  availableAtBranch!: string | null;

  @Column('uuid', { nullable: true })
  onHoldAtBranch!: string | null;

  @Column({ type: 'enum', enum: BookState })
  state!: BookState;

  getBookId(): BookId {
    return new BookId(this.bookId);
  }

  toDomainModel(): Book {
    let check: never;
    switch (this.state) {
      case BookState.Available:
        return this.toAvailableBook();
      case BookState.OnHold:
        return this.toBookOnHold();
      default:
        check = this.state;
        throw new Error(
          `Can't map book with state: ${this.state} to any model`
        );
    }
  }

  toAvailableBook(): AvailableBook {
    if (!this.availableAtBranch) {
      throw new Error('availableAtBranch is empty');
    }
    return new AvailableBook(
      this.getBookId(),
      new LibraryBranchId(this.availableAtBranch)
    );
  }

  toBookOnHold(): BookOnHold {
    if (!this.onHoldAtBranch) {
      throw new Error('onHoldAtBranch is empty');
    }
    return new BookOnHold(
      this.getBookId(),
      new LibraryBranchId(this.onHoldAtBranch)
    );
  }

  static restore(
    data: Omit<
      BookEntity,
      | 'getBookId'
      | 'getLibraryBranchId'
      | 'toAvailableBook'
      | 'toDomainModel'
      | 'toBookOnHold'
    >
  ): BookEntity {
    return Object.assign(new BookEntity(), data);
  }
}
