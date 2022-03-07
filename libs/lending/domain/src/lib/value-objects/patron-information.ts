import { PatronId } from './patron-id';
import { PatronType } from './patron-type';

export class PatronInformation {
  constructor(
    public readonly patronId: PatronId,
    public readonly type: PatronType
  ) {}

  isRegular(): boolean {
    return this.type === PatronType.Regular;
  }
}
