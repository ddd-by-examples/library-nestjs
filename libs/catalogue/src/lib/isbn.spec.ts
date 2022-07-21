import { ISBN } from './isbn';

describe('ISBN', () => {
  it('isbn should be correct', () => {
    // when
    const isbn = new ISBN('123412341X');
    // then
    expect(isbn.value).toEqual('123412341X');
  });

  it('isbn should be trimmed', () => {
    // when
    const isbn = new ISBN('  1234123414  ');
    // then
    expect(isbn.value).toEqual('1234123414');
  });

  it('wrong isbn should not be accepted', () => {
    expect(() => new ISBN('not isbn')).toThrowError();
  });
});
