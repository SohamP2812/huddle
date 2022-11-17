import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { Teams } from 'components/Teams/Teams';

it('renders without crashing', () => {
  renderWithRouter(<Teams />);
});
