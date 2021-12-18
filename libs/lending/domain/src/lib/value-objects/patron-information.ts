import { PatronType } from './patron-type';

export class PatronInformation {
  constructor(private readonly type: PatronType) {}

  isRegular(): boolean {
    return this.type === PatronType.Regular;
  }
}
