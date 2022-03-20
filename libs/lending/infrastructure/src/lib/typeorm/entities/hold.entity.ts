import { BookId, Hold, LibraryBranchId } from '@library/lending/domain';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @ManyToOne(() => PatronEntity)
  patronId!: string;

  static create(
    data: Omit<
      HoldEntity,
      'id' | 'toHoldModel' | 'getLibraryBranchId' | 'getBookId'
    >
  ): HoldEntity {
    return Object.assign(new HoldEntity(), data);
  }

  toHoldModel(): Hold {
    return new Hold(this.getBookId(), this.getLibraryBranchId());
  }

  getLibraryBranchId(): LibraryBranchId {
    return new LibraryBranchId(this.libraryBranchId);
  }

  getBookId(): BookId {
    return new BookId(this.bookId);
  }
}
