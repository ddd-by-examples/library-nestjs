import {
  BookHoldCanceled,
  BookHoldCancelingFailed,
  BookId,
  BookOnHold,
  Patron,
  PatronId,
} from '@library/lending/domain';
import { InvalidArgumentException, Result } from '@library/shared/domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { match } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getOrElseW } from 'fp-ts/Option';
import { PatronRepository } from '../ports/patron.repository';
import { CancelHoldCommand } from './cancel-hold.command';
import { FindBookOnHold } from './find-book-on-hold';

@CommandHandler(CancelHoldCommand)
export class CancelHoldHandler implements ICommandHandler<CancelHoldCommand> {
  constructor(
    private readonly findBookOnHold: FindBookOnHold,
    private readonly patronRepository: PatronRepository
  ) {}
  async execute(command: CancelHoldCommand): Promise<Result> {
    const bookOnHold = await this.findBook(command.bookId, command.patronId);
    const patron = await this.findPatron(command.patronId);
    const result = patron.cancelHold(bookOnHold);
    return pipe(
      result,
      match<BookHoldCancelingFailed, BookHoldCanceled, Promise<Result>>(
        this.publishOnFail.bind(this),
        this.publishOnSuccess.bind(this)
      )
    );
  }

  private findBook(bookId: BookId, patronId: PatronId): Promise<BookOnHold> {
    return this.findBookOnHold.findBookOnHold(bookId, patronId).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Cannot find book on hold with Id: ${bookId}`
          );
        })
      )
    );
  }

  private findPatron(patronId: PatronId): Promise<Patron> {
    return this.patronRepository.findById(patronId).then((result) =>
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

  private async publishOnFail(
    bookCancelingFailed: BookHoldCancelingFailed
  ): Promise<Result.Rejection> {
    await this.patronRepository.publish(bookCancelingFailed);

    return Result.Rejection;
  }

  private async publishOnSuccess(
    bookHoldCanceled: BookHoldCanceled
  ): Promise<Result.Success> {
    await this.patronRepository.publish(bookHoldCanceled);

    return Result.Success;
  }
}
