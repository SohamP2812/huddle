import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { User } from 'components/User/User';

it('renders without crashing', () => {
  renderWithRouter(<User />);
});
