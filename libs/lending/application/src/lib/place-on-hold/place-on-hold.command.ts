import {
  BookId,
  HoldDuration,
  NumberOfDays,
  PatronId,
} from '@library/lending/domain';
import { Command } from '@nestjs-architects/typed-cqrs';
import { pipe } from 'fp-ts/lib/function';
import { getOrElse, map, Option, some } from 'fp-ts/Option';

export class PlaceOnHoldCommand extends Command<void> {
  static closeEnded(
    patron: PatronId,
    bookId: BookId,
    forDays: number
  ): PlaceOnHoldCommand {
    return new PlaceOnHoldCommand(patron, bookId, some(forDays));
  }

  constructor(
    public readonly patron: PatronId,
    public readonly bookId: BookId,
    public readonly noOfDays: Option<number>
  ) {
    super();
  }

  get holdDuration(): HoldDuration {
    return pipe(
      this.noOfDays,
      map(NumberOfDays.of),
      map(HoldDuration.closeEnded),
      getOrElse(HoldDuration.openEnded)
    );
  }
}
