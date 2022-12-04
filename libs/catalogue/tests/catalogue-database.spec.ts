import { TestingMikroOrmModule } from '@library/shared-infrastructure-testing';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { none, some } from 'fp-ts/Option';
import { BookType } from '../src/lib/book-type';
import { CatalogueDatabase } from '../src/lib/catalogue-database';
import { CatalogueModule } from '../src/lib/catalogue.module';
import { ISBN } from '../src/lib/isbn';
import { BookFixture } from './book.fixtures';

describe('CatalogueDatabase', () => {
  let app: TestingModule;
  let catalogueDatabase: CatalogueDatabase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), CatalogueModule, TestingMikroOrmModule],
    }).compile();

    catalogueDatabase = moduleRef.get<CatalogueDatabase>(CatalogueDatabase);
    app = await moduleRef.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.only('should be able to save and load new book', async () => {
    // given
    const book = BookFixture.DDD;
    // when
    await catalogueDatabase.saveNewBook(book);
    // and
    const ddd = await catalogueDatabase.findBookByIsbn(
      new ISBN(BookFixture.DDD_ISBN_STR)
    );
    // then
    expect(ddd).toBeDefined();
    expect(ddd).toEqual(some(book));
  });

  it('should not load not present book', async () => {
    // when
    const ddd = await catalogueDatabase.findBookByIsbn(
      BookFixture.NON_PRESENT_ISBN
    );
    // then:
    expect(ddd).toEqual(none);
  });

  it('should save book instance', async () => {
    // when
    const promise = catalogueDatabase.saveNewBookInstance(
      BookFixture.DDD.toAnInstance(BookType.Restricted)
    );
    // then
    await expect(promise).resolves.toBeDefined();
  });
});
