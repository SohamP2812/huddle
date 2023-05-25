import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { TeamInvite } from 'components/TeamInvite/TeamInvite';

it('renders without crashing', () => {
  renderWithRouter(<TeamInvite />);
});
