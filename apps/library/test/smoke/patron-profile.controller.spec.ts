import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatronType } from 'libs/lending/domain/src/lib/value-objects/patron-type';
import { Book } from 'libs/lending/infrastructure/src/lib/typeorm/entities/book.entity';
import { HoldEntity } from 'libs/lending/infrastructure/src/lib/typeorm/entities/hold.entity';
import { PatronEntity } from 'libs/lending/infrastructure/src/lib/typeorm/entities/patron.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app/app.module';

describe('PatronProfileController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Given patron', () => {
    let patronRepo: Repository<PatronEntity>;
    const patronId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
    beforeAll(async () => {
      patronRepo = app.get(getRepositoryToken(PatronEntity));
      await patronRepo.insert(
        PatronEntity.restore({
          id: patronId,
          resourcesOnHold: [],
          patronType: PatronType.Regular,
        })
      );
    });

    afterAll(async () => {
      await patronRepo.delete(patronId);
    });

    describe('And book', () => {
      let bookRepo: Repository<Book>;
      const bookId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
      const libraryBranchId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';

      beforeAll(async () => {
        bookRepo = app.get(getRepositoryToken(Book));
        await bookRepo.insert(
          Book.restore({ bookId, availableAtBranch: libraryBranchId })
        );
      });

      afterAll(async () => {
        await bookRepo.delete(bookId);
        app.get(getRepositoryToken(HoldEntity)).delete({ patronId });
      });

      it(`/POST /profiles/:patronId/holds`, () => {
        return request(app.getHttpServer())
          .post(`/profiles/${patronId}/holds`)
          .send({
            bookId,
            numberOfDays: 2,
          })
          .expect(201);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
