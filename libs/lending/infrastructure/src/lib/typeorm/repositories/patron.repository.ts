import {
  PatronEvent,
  Patron,
  PatronId,
  PatronFactory,
  BookId,
} from '@library/lending/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { isNone, Option } from 'fp-ts/lib/Option';
import { PatronRepository } from 'libs/lending/application/src/lib/ports/patron.repository';
import { LibraryBranchId } from 'libs/lending/domain/src/lib/value-objects/library-branch-id';
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
      patronEntity.resourcesOnHold.map((entity) => [
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
    private readonly domainModelMapper: DomainModelMapper
  ) {}

  publish(event: PatronEvent): Promise<Patron> {
    return this.handleNextEvent(event);
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
