import { BookRepository, PatronRepository } from '@library/lending/application';
import {
  Book,
  BookCheckedOut,
  BookCheckOutFailed,
  BookId,
  Patron,
  PatronId,
} from '@library/lending/domain';
import { InvalidArgumentException, Result } from '@library/shared/domain';
import { IInferredCommandHandler } from '@nestjs-architects/typed-cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { match } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getOrElseW } from 'fp-ts/Option';
import { CheckOutBookCommand } from './check-out-book.command';

@CommandHandler(CheckOutBookCommand)
export class CheckOutBookHandler
  implements IInferredCommandHandler<CheckOutBookCommand>
{
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly patronRepository: PatronRepository
  ) {}

  async execute(command: CheckOutBookCommand): Promise<Result> {
    const book = await this.findBook(command.bookId);
    const patron = await this.findPatron(command.patronId);
    const result = patron.checkoutBook(book);
    return pipe(
      result,
      match<BookCheckOutFailed, BookCheckedOut, Promise<Result>>(
        this.publishOnFail.bind(this),
        this.publishOnSuccess.bind(this)
      )
    );
  }

  private findBook(id: BookId): Promise<Book> {
    return this.bookRepository.findById(id).then((result) =>
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
    return this.patronRepository.findById(patronId).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Patron with given Id does not exists: ${patronId}`
          );
        })
      )
    );
  }

  private async publishOnFail(
    bookCheckOutFailed: BookCheckOutFailed
  ): Promise<Result.Rejection> {
    await this.patronRepository.publish(bookCheckOutFailed);

    return Result.Rejection;
  }

  private async publishOnSuccess(
    bookCheckedOut: BookCheckedOut
  ): Promise<Result.Success> {
    await this.patronRepository.publish(bookCheckedOut);

    return Result.Success;
  }
}
