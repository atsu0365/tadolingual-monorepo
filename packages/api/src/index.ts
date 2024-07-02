// packages/api/src/index.ts
export const hello = () => 'Hello from api';

// packages/api/__tests__/api.test.ts
import { hello } from '../src';

test('api function returns correct greeting', () => {
  expect(hello()).toBe('Hello from api');
});