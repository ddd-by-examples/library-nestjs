import {
  BookHoldCanceled,
  BookId,
  BookPlacedOnHold,
  BookPlacedOnHoldEvents,
  LibraryBranchId,
  PatronEvent,
  PatronId,
  PatronType,
} from '@library/lending/domain';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HoldEntity } from './hold.entity';

@Entity()
export class PatronEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => HoldEntity, (hold) => hold.patron, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  booksOnHold!: HoldEntity[];

  @Column({ type: 'enum', enum: PatronType })
  patronType!: PatronType;

  get patronId(): PatronId {
    return new PatronId(this.id);
  }

  static restore(
    data: Omit<
      PatronEntity,
      | 'patronId'
      | 'handle'
      | 'handleBookPlacedOnHold'
      | 'handleBookHoldCanceled'
    >
  ): PatronEntity {
    return Object.assign(new PatronEntity(), data);
  }

  handle(event: PatronEvent): PatronEntity {
    if (event instanceof BookPlacedOnHold) {
      return this.handleBookPlacedOnHold(event);
    }

    if (event instanceof BookPlacedOnHoldEvents) {
      return this.handleBookPlacedOnHold(event.bookPlacedOnHold);
    }

    if (event instanceof BookHoldCanceled) {
      return this.handleBookHoldCanceled(event);
    }

    throw new Error(`No handler for event ${event.constructor.name}`);
  }
  handleBookHoldCanceled(event: BookHoldCanceled): PatronEntity {
    return this.removeHoldIfPresent(
      event.patronId,
      event.bookId,
      event.libraryBranchId
    );
  }

  handleBookPlacedOnHold(event: BookPlacedOnHold): PatronEntity {
    this.booksOnHold.push(
      HoldEntity.create({
        patronId: event.patronId.value,
        bookId: event.bookId.value,
        libraryBranchId: event.libraryBranchId.value,
      })
    );
    return this;
  }

  private removeHoldIfPresent(
    patronId: PatronId,
    bookId: BookId,
    libraryBranchId: LibraryBranchId
  ): PatronEntity {
    this.booksOnHold = this.booksOnHold.filter(
      (entity) => !entity.is(patronId, bookId, libraryBranchId)
    );
    return this;
  }
}
