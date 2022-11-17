import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { App } from './App';

it('renders without crashing', () => {
  renderWithRouter(<App />);
  expect(screen.getByText('Sign Up')).toBeInTheDocument();
});
