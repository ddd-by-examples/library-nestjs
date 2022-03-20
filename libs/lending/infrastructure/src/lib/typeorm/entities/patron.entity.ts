import {
  BookPlacedOnHold,
  BookPlacedOnHoldEvents,
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
  @OneToMany(() => HoldEntity, (hold) => hold.patronId, {
    eager: true,
    cascade: true,
  })
  resourcesOnHold!: HoldEntity[];
  @Column()
  patronType!: PatronType;

  get patronId(): PatronId {
    return new PatronId(this.id);
  }

  static restore(
    data: Omit<PatronEntity, 'patronId' | 'handle' | 'handleBookPlacedOnHold'>
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

    throw new Error(`No handler for event ${event.constructor.name}`);
  }

  handleBookPlacedOnHold(event: BookPlacedOnHold): PatronEntity {
    this.resourcesOnHold.push(
      HoldEntity.create({
        patronId: event.patronId.value,
        bookId: event.bookId.value,
        libraryBranchId: event.libraryBranchId.value,
      })
    );
    return this;
  }
}
