import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { SignUp } from 'components/SignUp/SignUp';

it('renders without crashing', () => {
  renderWithRouter(<SignUp />);
});
