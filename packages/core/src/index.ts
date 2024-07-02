// packages/core/src/index.ts
export const hello = () => 'Hello from core';

// packages/core/__tests__/core.test.ts
import { hello } from '../src';

test('core function returns correct greeting', () => {
  expect(hello()).toBe('Hello from core');
});