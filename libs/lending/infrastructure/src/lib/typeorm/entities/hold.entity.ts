import {
  BookId,
  Hold,
  LibraryBranchId,
  PatronId,
} from '@library/lending/domain';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatronEntity } from './patron.entity';

@Entity()
export class HoldEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'uuid',
  })
  libraryBranchId!: string;

  @Column({
    type: 'uuid',
  })
  bookId!: string;

  @ManyToOne(() => PatronEntity, { orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'patronId' })
  patron!: PatronEntity;

  @Column({
    type: 'uuid',
  })
  patronId!: string;

  static create(
    data: Omit<
      HoldEntity,
      | 'id'
      | 'is'
      | 'toHoldModel'
      | 'getLibraryBranchId'
      | 'getBookId'
      | 'getPatronId'
      | 'patron'
    >
  ): HoldEntity {
    return Object.assign(new HoldEntity(), data);
  }

  getLibraryBranchId(): LibraryBranchId {
    return new LibraryBranchId(this.libraryBranchId);
  }

  getBookId(): BookId {
    return new BookId(this.bookId);
  }

  getPatronId(): PatronId {
    return new PatronId(this.patronId);
  }

  is(
    patronId: PatronId,
    bookId: BookId,
    libraryBranchId: LibraryBranchId
  ): boolean {
    return (
      this.getPatronId().equals(patronId) &&
      this.getBookId().equals(bookId) &&
      this.getLibraryBranchId().equals(libraryBranchId)
    );
  }

  toHoldModel(): Hold {
    return new Hold(this.getBookId(), this.getLibraryBranchId());
  }
}
