import { Book, BookHoldCanceled, BookOnHold } from '@library/lending/domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Option';
import { BookRepository } from './ports/book.repository';

@EventsHandler(BookHoldCanceled)
export class BookHoldCanceledEventHandler
  implements IEventHandler<BookHoldCanceled>
{
  constructor(private readonly bookRepository: BookRepository) {}

  async handle(bookHoldCanceled: BookHoldCanceled): Promise<void> {
    const maybeBook = await this.bookRepository.findById(
      bookHoldCanceled.bookId
    );
    pipe(
      maybeBook,
      map((book) => this.handleHoldCanceled(book, bookHoldCanceled)),
      map(this.saveBook.bind(this))
    );
  }
  handleHoldCanceled(book: Book, holdCanceled: BookHoldCanceled): Book {
    switch (book.constructor) {
      case BookOnHold:
        return (book as BookOnHold).handleHoldCanceled(holdCanceled);
      default:
        return book;
    }
  }

  private async saveBook(book: Book): Promise<Book> {
    await this.bookRepository.save(book);
    return book;
  }
}
