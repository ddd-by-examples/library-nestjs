import { TinyTypeOf } from 'tiny-types';
import { randomUUID } from 'crypto';

export class Uuid extends TinyTypeOf<string>() {
  static generate(): Uuid {
    return new Uuid(randomUUID());
  }
}
