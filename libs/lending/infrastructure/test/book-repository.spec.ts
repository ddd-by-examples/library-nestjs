import { BookRepository } from '@library/lending/application';
import { BookId } from '@library/lending/domain';
import { TestingTypeOrmModule } from '@library/shared-infrastructure-testing';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { some } from 'fp-ts/Option';
import { BookBuilder } from '../../domain/tests/book.fixtures';
import { LendingTypeOrmModule } from '../src/lib/typeorm/lending-typeorm.module';

describe.each([[LendingTypeOrmModule, TestingTypeOrmModule]])(
  'BookRepository',
  (lendingInfrastructure, coreInfrastructure) => {
    let app: TestingModule;
    let bookRepository: BookRepository;
    const bookId = BookId.generate();

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          coreInfrastructure,
          lendingInfrastructure,
        ],
      }).compile();

      bookRepository = moduleRef.get<BookRepository>(BookRepository);
      app = await moduleRef.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('persistence in real database should work', async () => {
      // given
      const availableBook = new BookBuilder()
        .withId(bookId)
        .buildCirculatingBook();
      // when
      await bookRepository.save(availableBook);
      // then
      await expect(bookRepository.findById(bookId)).resolves.toEqual(
        some(availableBook)
      );
    });
  }
);
