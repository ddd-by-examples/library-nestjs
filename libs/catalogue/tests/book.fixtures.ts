import { Book } from '../src/lib/book';
import { ISBN } from '../src/lib/isbn';

export class BookFixture {
  static readonly DDD_ISBN_STR = '0321125215';

  static readonly DDD_ISBN_10: ISBN = new ISBN(BookFixture.DDD_ISBN_STR);

  static readonly NON_PRESENT_ISBN: ISBN = new ISBN('032112521X');

  static readonly DDD = Book.create(
    BookFixture.DDD_ISBN_STR,
    'DDD',
    'Eric Evans'
  );
}
