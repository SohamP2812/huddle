import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { SignIn } from 'components/SignIn/SignIn';

it('renders without crashing', () => {
  renderWithRouter(<SignIn />);
});
