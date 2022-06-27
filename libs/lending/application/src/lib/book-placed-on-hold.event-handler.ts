import {
  AvailableBook,
  Book,
  BookDuplicateHoldFound,
  BookOnHold,
  BookPlacedOnHold,
  BookPlacedOnHoldEvents,
} from '@library/lending/domain';
import { DomainEvents } from '@library/shared/domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { pipe } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/Option';
import { BookRepository } from './ports/book.repository';

@EventsHandler(BookPlacedOnHold, BookPlacedOnHoldEvents)
export class BookPlacedOnHoldEventHandler
  implements IEventHandler<BookPlacedOnHold | BookPlacedOnHoldEvents>
{
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly domainEvents: DomainEvents
  ) {}

  async handle(
    event: BookPlacedOnHold | BookPlacedOnHoldEvents
  ): Promise<void> {
    let bookPlacedOnHold: BookPlacedOnHold;
    if (event instanceof BookPlacedOnHoldEvents) {
      bookPlacedOnHold = event.bookPlacedOnHold;
    } else {
      bookPlacedOnHold = event;
    }
    const maybeBook = await this.bookRepository.findById(
      bookPlacedOnHold.bookId
    );
    pipe(
      maybeBook,
      map((book) => this.handleBookPlacedOnHold(book, bookPlacedOnHold)),
      map(this.saveBook.bind(this))
    );
  }

  private handleBookPlacedOnHold(
    book: Book,
    bookPlacedOnHold: BookPlacedOnHold
  ): Book {
    switch (book.constructor) {
      case AvailableBook:
        return (book as AvailableBook).handleBookPlacedOnHold(bookPlacedOnHold);
      case BookOnHold:
        return this.raiseDuplicateHoldFoundEvent(
          book as BookOnHold,
          bookPlacedOnHold
        );
      default:
        return book;
    }
  }

  private raiseDuplicateHoldFoundEvent(
    onHold: BookOnHold,
    bookPlacedOnHold: BookPlacedOnHold
  ): BookOnHold {
    if (onHold.by(bookPlacedOnHold.patronId)) {
      return onHold;
    }
    this.domainEvents.publish(
      new BookDuplicateHoldFound(onHold.bookId, onHold.patronId)
    );
    return onHold;
  }

  private async saveBook(book: Book): Promise<Book> {
    await this.bookRepository.save(book);
    return book;
  }
}
