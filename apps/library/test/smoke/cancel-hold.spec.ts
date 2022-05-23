import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatronType } from 'libs/lending/domain/src/lib/value-objects/patron-type';
import {
  BookEntity,
  BookState,
} from 'libs/lending/infrastructure/src/lib/typeorm/entities/book.entity';
import { HoldEntity } from 'libs/lending/infrastructure/src/lib/typeorm/entities/hold.entity';
import { PatronEntity } from 'libs/lending/infrastructure/src/lib/typeorm/entities/patron.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app/app.module';

describe('Take book on hold', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Given patron', () => {
    describe('And book on hold', () => {
      let patronRepo: Repository<PatronEntity>;
      let bookRepo: Repository<BookEntity>;
      const patronId = '55760e4e-9aa9-4754-ae26-159df2fd03da';
      const bookId = '55760e4e-9aa9-4754-ae26-159df2fd03da';
      const libraryBranchId = '55760e4e-9aa9-4754-ae26-159df2fd03dc';
      beforeAll(async () => {
        bookRepo = app.get(getRepositoryToken(BookEntity));
        await bookRepo.insert(
          BookEntity.restore({
            bookId,
            availableAtBranch: null,
            onHoldAtBranch: libraryBranchId,
            state: BookState.OnHold,
          })
        );
        patronRepo = app.get(getRepositoryToken(PatronEntity));
        await patronRepo.save(
          patronRepo.create(
            PatronEntity.restore({
              id: patronId,
              booksOnHold: [
                HoldEntity.create({ bookId, libraryBranchId, patronId }),
              ],
              patronType: PatronType.Regular,
            })
          )
        );
      });

      afterAll(async () => {
        await patronRepo.delete(patronId);
        await bookRepo.delete(bookId);
      });

      it(`/DELETE /profiles/:profileId/holds/:bookId`, () => {
        return request(app.getHttpServer())
          .delete(`/profiles/${patronId}/holds/${bookId}`)
          .expect(204);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
