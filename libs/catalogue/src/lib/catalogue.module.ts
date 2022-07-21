import { SharedInfrastructureNestjsCqrsEventsModule } from '@library/shared/infrastructure-nestjs-cqrs-events';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book';
import { BookInstance } from './book-instance';
import { BookController } from './book.controller';
import { Catalogue } from './catalogue';
import { CatalogueDatabase } from './catalogue-database';

@Module({
  imports: [
    SharedInfrastructureNestjsCqrsEventsModule,
    TypeOrmModule.forFeature([Book, BookInstance]),
  ],
  controllers: [BookController],
  providers: [Catalogue, CatalogueDatabase],
})
export class CatalogueModule {}
