// packages/media/src/index.ts
export const hello = () => 'Hello from media';

// packages/media/__tests__/media.test.ts
import { hello } from '../src';

test('media function returns correct greeting', () => {
  expect(hello()).toBe('Hello from media');
});