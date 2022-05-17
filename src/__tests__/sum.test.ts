import sum from '../ts/sum';

test('add 1+2 to equal 3', () => {
  let x: number = 1,
    y: number = 2;
  let expected: number = 3;

  let actual: number = sum(x, y);

  expect(actual).toBe(expected);
});
