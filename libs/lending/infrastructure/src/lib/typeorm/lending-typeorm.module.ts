import {
  FindAvailableBook,
  FindBookOnHold,
  PatronRepository,
} from '@library/lending/application';
import { PatronFactory } from '@library/lending/domain';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { HoldEntity } from './entities/hold.entity';
import { PatronEntity } from './entities/patron.entity';
import { BookRepo } from './repositories/book.repository';
import {
  DomainModelMapper,
  PatronRepo,
} from './repositories/patron.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, PatronEntity, HoldEntity])],
  providers: [
    BookRepo,
    PatronRepo,
    DomainModelMapper,
    PatronFactory, // @ToDo
    { provide: FindAvailableBook, useExisting: BookRepo },
    { provide: FindBookOnHold, useExisting: BookRepo },
    { provide: PatronRepository, useExisting: PatronRepo },
  ],
  exports: [FindAvailableBook, FindBookOnHold, PatronRepository],
})
export class LendingTypeOrmModule {}
