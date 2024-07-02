// packages/ui/src/index.tsx
import React from 'react';
export const Button = () => <button>Click me</button>;

// packages/ui/__tests__/ui.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../src';

test('Button component renders correctly', () => {
  const { getByText } = render(<Button />);
  expect(getByText('Click me')).toBeInTheDocument();
});