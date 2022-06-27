import { PatronRepository } from '@library/lending/application';
import {
  BookId,
  LibraryBranchId,
  Patron,
  PatronEvent,
  PatronFactory,
  PatronId,
} from '@library/lending/domain';
import { DomainEvents } from '@library/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import { Repository } from 'typeorm';
import { PatronEntity } from '../entities/patron.entity';

@Injectable()
export class DomainModelMapper {
  constructor(private readonly patronFactory: PatronFactory) {}

  map(entity: PatronEntity): Patron {
    return this.patronFactory.create(
      entity.patronType,
      entity.patronId,
      this.mapPatronHolds(entity)
    );
  }

  mapPatronHolds(patronEntity: PatronEntity): Set<[BookId, LibraryBranchId]> {
    return new Set(
      patronEntity.booksOnHold.map((entity) => [
        entity.getBookId(),
        entity.getLibraryBranchId(),
      ])
    );
  }
}

@Injectable()
export class PatronRepo implements PatronRepository {
  constructor(
    @InjectRepository(PatronEntity)
    private readonly typeormRepo: Repository<PatronEntity>,
    private readonly domainEvents: DomainEvents,
    private readonly domainModelMapper: DomainModelMapper
  ) {}

  publish(event: PatronEvent): Promise<Patron> {
    const result = this.handleNextEvent(event);
    this.domainEvents.publish(event);
    return result;
  }

  async findById(id: PatronId): Promise<Option<Patron>> {
    const patron = await this.typeormRepo.findOne(id.value);
    return pipe(
      option.fromNullable(patron),
      option.map((patron) => this.domainModelMapper.map(patron))
    );
  }

  private async handleNextEvent(event: PatronEvent): Promise<Patron> {
    let entity = await this.typeormRepo.findOneOrFail(event.patronId.value);
    entity = entity.handle(event);
    await this.typeormRepo.save(entity);
    return this.domainModelMapper.map(entity);
  }
}
