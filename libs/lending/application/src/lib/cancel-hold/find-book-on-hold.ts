import { BookId, BookOnHold, PatronId } from '@library/lending/domain';
import { Option } from 'fp-ts/Option';

export abstract class FindBookOnHold {
  abstract findBookOnHold(
    bookId: BookId,
    patronId: PatronId
  ): Promise<Option<BookOnHold>>;
}
