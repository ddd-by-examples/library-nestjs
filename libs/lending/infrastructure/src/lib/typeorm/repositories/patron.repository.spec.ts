import { PatronRepository } from '@library/lending/application';
import {
  BookHoldCanceled,
  BookId,
  BookPlacedOnHold,
  DateVO,
  LibraryBranchId,
  PatronId,
  PatronType,
} from '@library/lending/domain';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity, BookState } from '../entities/book.entity';
import { HoldEntity } from '../entities/hold.entity';
import { PatronEntity } from '../entities/patron.entity';
import { LendingTypeOrmModule } from '../lending-typeorm.module';
import { PatronRepo } from './patron.repository';

describe('PatronRepository', () => {
  let patronRepo: PatronRepo;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),
        LendingTypeOrmModule,
      ],
    }).compile();

    patronRepo = moduleRef.get(PatronRepository);
  });

  describe('Given patron', () => {
    let patronTypeOrmRepo: Repository<PatronEntity>;
    const patronId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
    beforeAll(async () => {
      patronTypeOrmRepo = moduleRef.get(getRepositoryToken(PatronEntity));
      await patronTypeOrmRepo.insert(
        PatronEntity.restore({
          id: patronId,
          booksOnHold: [],
          patronType: PatronType.Regular,
        })
      );
    });

    afterAll(async () => {
      await patronTypeOrmRepo.delete(patronId);
    });

    describe('And available book', () => {
      let bookRepo: Repository<BookEntity>;
      const bookId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
      const libraryBranchId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';

      beforeAll(async () => {
        bookRepo = moduleRef.get(getRepositoryToken(BookEntity));
        await bookRepo.insert(
          BookEntity.restore({
            bookId,
            availableAtBranch: libraryBranchId,
            state: BookState.Available,
            onHoldAtBranch: null,
          })
        );
      });

      afterAll(async () => {
        await bookRepo.delete(bookId);
      });

      describe('publish', () => {
        describe('BookPlacedOnHold', () => {
          let holdsRepo: Repository<HoldEntity>;

          beforeAll(async () => {
            holdsRepo = moduleRef.get(getRepositoryToken(HoldEntity));
            await patronRepo.publish(
              new BookPlacedOnHold(
                new PatronId(patronId),
                new BookId(bookId),
                new LibraryBranchId(libraryBranchId),
                DateVO.now()
              )
            );
          });

          afterAll(async () => {
            await holdsRepo.delete({ patronId });
          });

          it('should add record to holds table', async () => {
            expect(await holdsRepo.count()).toBe(1);
          });
        });
      });
    });
  });

  describe('Given patron', () => {
    describe('And book on hold', () => {
      let patronTypeOrmRepo: Repository<PatronEntity>;
      const patronId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
      beforeAll(async () => {
        bookRepo = moduleRef.get(getRepositoryToken(BookEntity));
        await bookRepo.insert(
          BookEntity.restore({
            bookId,
            availableAtBranch: null,
            onHoldAtBranch: libraryBranchId,
            state: BookState.OnHold,
          })
        );
        patronTypeOrmRepo = moduleRef.get(getRepositoryToken(PatronEntity));
        await patronTypeOrmRepo.save(
          patronTypeOrmRepo.create(
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
        await patronTypeOrmRepo.delete(patronId);
        await bookRepo.delete(bookId);
      });

      let bookRepo: Repository<BookEntity>;
      const bookId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';
      const libraryBranchId = '55760e4e-9aa9-4754-ae26-159df2fd03dd';

      describe('publish', () => {
        describe('BookHoldCanceled', () => {
          let holdsRepo: Repository<HoldEntity>;

          beforeAll(async () => {
            holdsRepo = moduleRef.get(getRepositoryToken(HoldEntity));
            await patronRepo.publish(
              new BookHoldCanceled(
                new PatronId(patronId),
                new BookId(bookId),
                new LibraryBranchId(libraryBranchId)
              )
            );
          });

          it('should remove record from holds table', async () => {
            expect(await holdsRepo.count({ where: { patronId } })).toBe(
              0
            );
          });
        });
      });
    });
  });
});
