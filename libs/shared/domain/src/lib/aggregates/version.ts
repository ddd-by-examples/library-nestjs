import { TinyTypeOf } from 'tiny-types';

export class Version extends TinyTypeOf<number>() {
  static zero(): Version {
    return new Version(0);
  }
}
