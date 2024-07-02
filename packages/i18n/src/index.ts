// packages/i18n/src/index.ts
export const hello = () => 'Hello from i18n';

// packages/i18n/__tests__/i18n.test.ts
import { hello } from '../src';

test('i18n function returns correct greeting', () => {
  expect(hello()).toBe('Hello from i18n');
});