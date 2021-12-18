import { ensure, isGreaterThan, TinyTypeOf } from 'tiny-types';

export class NumberOfDays extends TinyTypeOf<number>() {
  private constructor(days: number) {
    super(days);
    ensure('NumberOfDays', days, isGreaterThan(0));
  }

  static of(days: number): NumberOfDays {
    return new NumberOfDays(days);
  }
}
