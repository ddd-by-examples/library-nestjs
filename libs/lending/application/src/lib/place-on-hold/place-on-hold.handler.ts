import {
        AvailableBook, BookHoldFailed, BookId, BookPlacedOnHoldEvents, Patron,
        PatronId
} from '@library/lending/domain';
import { InvalidArgumentException, Result } from '@library/shared/domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { match } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getOrElseW } from 'fp-ts/Option';
import { PatronRepository } from '../ports/patron.repository';
import { FindAvailableBook } from './find-available-book';
import { PlaceOnHoldCommand } from './place-on-hold.command';

@CommandHandler(PlaceOnHoldCommand)
export class PlaceOnHoldHandler implements ICommandHandler<PlaceOnHoldCommand> {
  constructor(
    private readonly findAvailableBook: FindAvailableBook,
    private readonly repository: PatronRepository
  ) {}

  async execute(command: PlaceOnHoldCommand): Promise<Result> {
    const availableBook = await this.findBook(command.bookId);
    const patron = await this.findPatron(command.patron);
    const result = patron.placeOnHold(availableBook, command.holdDuration);
    return pipe(
      result,
      match(this.publishOnFail.bind(this), this.publishOnSuccess.bind(this))
    );
  }

  private findBook(id: BookId): Promise<AvailableBook> {
    return this.findAvailableBook.findAvailableBookById(id).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Cannot find available book with Id: ${id}`
          );
        })
      )
    );
  }

  private findPatron(patronId: PatronId): Promise<Patron> {
    return this.repository.findById(patronId).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Patron with given Id does not exists: : ${patronId}`
          );
        })
      )
    );
  }

  private publishOnFail(bookHoldFailed: BookHoldFailed): Result.Rejection {
    this.repository.publish(bookHoldFailed);

    return Result.Rejection;
  }

  private publishOnSuccess(
    placedOnHold: BookPlacedOnHoldEvents
  ): Result.Success {
    this.repository.publish(placedOnHold);

    return Result.Success;
  }
}
