import { hello } from '../src';

test('media function returns correct greeting', () => {
  expect(hello()).toBe('Hello from media');
});