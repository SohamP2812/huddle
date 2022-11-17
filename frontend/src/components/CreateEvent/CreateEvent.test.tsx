import { renderWithRouter } from 'utils/testing';

import { CreateEvent } from 'components/CreateEvent/CreateEvent';

it('renders without crashing', () => {
  renderWithRouter(<CreateEvent />);
});
