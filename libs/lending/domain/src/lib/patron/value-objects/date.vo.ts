import { TinyTypeOf } from 'tiny-types';

export class DateVO extends TinyTypeOf<Date>() {
  static now(): DateVO {
    return new DateVO(new Date());
  }

  addDays(days: number): DateVO {
    const next = new Date(this.value.getTime());
    next.setDate(next.getDate() + days);
    return new DateVO(next);
  }
}
