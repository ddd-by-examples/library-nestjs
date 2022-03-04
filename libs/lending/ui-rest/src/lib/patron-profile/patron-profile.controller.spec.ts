import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PatronProfileModule } from './patron-profile.module';

describe('PatronProfileController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PatronProfileModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST /profiles/:patronId/holds`, () => {
    return request(app.getHttpServer())
      .post(`/profiles/55760e4e-9aa9-4754-ae26-159df2fd03dd/holds`)
      .send({
        bookId: '55760e4e-9aa9-4754-ae26-159df2fd03dd',
        numberOfDays: 2,
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
