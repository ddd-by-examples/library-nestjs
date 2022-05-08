import { BookId, PatronId } from '@library/lending/domain';
import { Result } from '@library/shared/domain';
import { Command } from '@nestjs-architects/typed-cqrs';

export class CancelHoldCommand extends Command<Result> {
  constructor(
    public readonly patronId: PatronId,
    public readonly bookId: BookId
  ) {
    super();
  }
}
