import { Book, BookId } from '@library/lending/domain';
import { Option } from 'fp-ts/Option';

export abstract class BookRepository {
  abstract findById(id: BookId): Promise<Option<Book>>;
  abstract save(book: Book): Promise<void>;
}
