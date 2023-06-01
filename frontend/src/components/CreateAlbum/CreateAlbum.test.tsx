import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/testing';

import { CreateAlbum } from 'components/CreateAlbum/CreateAlbum';

it('renders without crashing', () => {
  renderWithRouter(<CreateAlbum />);
});
