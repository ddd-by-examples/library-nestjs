import { Uuid } from '@library/shared/domain';
import { BookInstance } from './book-instance';
import { BookType } from './book-type';

export class BookInstanceAddedToCatalogue {
  constructor(
    public readonly eventId = Uuid.generate(),
    public readonly isbn: string,
    public readonly bookType: BookType,
    public readonly bookId: Uuid
  ) {}

  static fromBookInstance(
    bookInstance: BookInstance
  ): BookInstanceAddedToCatalogue {
    const bookInstanceSnapshot = bookInstance.getSnapshot();
    return new BookInstanceAddedToCatalogue(
      undefined,
      bookInstanceSnapshot.isbn.value,
      bookInstanceSnapshot.bookType,
      bookInstanceSnapshot.bookId
    );
  }
}
