import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { Account } from 'components/Account/Account';

it('renders without crashing', () => {
  renderWithRouter(<Account />);
});
