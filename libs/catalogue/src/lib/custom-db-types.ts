import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { Author, Title } from './book';
import { BookId } from './book-id';
import { ISBN } from './isbn';

export class AuthorType extends Type<Author, string> {
  convertToDatabaseValue(value: Author, platform: Platform): string {
    return value.value;
  }

  convertToJSValue(value: string, platform: Platform): Author {
    return new Author(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(100)`;
  }
}

export class TitleType extends Type<Title, string> {
  convertToDatabaseValue(value: Title, platform: Platform): string {
    return value.value;
  }

  convertToJSValue(value: string, platform: Platform): Title {
    return new Title(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(100)`;
  }
}

export class ISBNType extends Type<ISBN, string> {
  convertToDatabaseValue(value: ISBN, platform: Platform): string {
    return value.value;
  }

  convertToJSValue(value: string, platform: Platform): ISBN {
    return new ISBN(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(100)`;
  }
}

export class BookIdType extends Type<BookId, string> {
  convertToDatabaseValue(value: BookId, platform: Platform): string {
    return value.value;
  }

  convertToJSValue(value: string, platform: Platform): BookId {
    return new BookId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `UUID`;
  }
}
