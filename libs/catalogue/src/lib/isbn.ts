import { ensure, isString, matches, TinyTypeOf } from 'tiny-types';

export class ISBN extends TinyTypeOf<string>() {
  private static readonly VERY_SIMPLE_ISBN_CHECK = new RegExp(
    '^\\d{9}[\\d|X]$'
  );

  constructor(isbn: string) {
    super(isbn.trim());
    ensure(
      'ISBN',
      isbn.trim(),
      isString(),
      matches(ISBN.VERY_SIMPLE_ISBN_CHECK)
    );
  }
}
