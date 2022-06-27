import { BookId } from '../value-objects/book-id';
import { PatronId } from '../value-objects/patron-id';

export class BookDuplicateHoldFound {
  constructor(
    public readonly bookId: BookId,
    public readonly secondPatronId: PatronId
  ) {}
}
