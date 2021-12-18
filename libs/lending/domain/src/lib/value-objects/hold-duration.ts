import { ensure, isGreaterThanOrEqualTo, TinyType } from 'tiny-types';
import { DateVO } from './date.vo';
import { NumberOfDays } from './number-of-days';

export class HoldDuration extends TinyType {
  private constructor(
    public readonly from: DateVO,
    public readonly to: DateVO | null
  ) {
    super();
    if (to) {
      ensure(
        'HoldDuration "to"',
        to.value.getTime(),
        isGreaterThanOrEqualTo(from.value.getTime())
      );
    }
  }

  public static closeEnded(days: NumberOfDays): HoldDuration {
    const to = DateVO.now().addDays(days.value);
    return new HoldDuration(DateVO.now(), to);
  }
  static openEnded(): HoldDuration {
    return new HoldDuration(DateVO.now(), null);
  }
  isOpenEnded(): boolean {
    return !this.to;
  }
}
