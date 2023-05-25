import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { TeamInvites } from 'components/TeamInvites/TeamInvites';

it('renders without crashing', () => {
  renderWithRouter(<TeamInvites />);
});
