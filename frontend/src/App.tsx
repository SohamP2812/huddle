import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthComponent } from 'components/AuthComponent';

import { LandingPage } from 'components/LandingPage/LandingPage';
import { SignUp } from 'components/SignUp/SignUp';
import { SignIn } from 'components/SignIn/SignIn';
import { Account } from 'components/Account/Account';
import { CreateTeam } from 'components/CreateTeam/CreateTeam';
import { Teams } from 'components/Teams/Teams';
import { Team } from 'components/Team/Team';
import { CreateEvent } from 'components/CreateEvent/CreateEvent';
import { Event } from 'components/Event/Event';
import { EditEvent } from 'components/EditEvent/EditEvent';

import { useAnalytics } from 'hooks/useAnalytics';

export const App: FC = () => {
  useAnalytics();

  return (
    <Routes>
      <Route path="/" element={<AuthComponent children={<LandingPage />} />} />
      <Route path="sign-up" element={<AuthComponent children={<SignUp />} />} />
      <Route path="sign-in" element={<AuthComponent children={<SignIn />} />} />
      <Route path="account" element={<AuthComponent children={<Account />} isProtected />} />
      <Route path="account" element={<AuthComponent children={<Account />} isProtected />} />
      <Route path="create-team" element={<AuthComponent children={<CreateTeam />} isProtected />} />
      <Route path="teams" element={<AuthComponent children={<Teams />} isProtected />} />
      <Route path="teams/:team_id" element={<AuthComponent children={<Team />} isProtected />} />
      <Route
        path="teams/:team_id/create-event"
        element={<AuthComponent children={<CreateEvent />} isProtected />}
      />
      <Route
        path="teams/:team_id/events/:event_id"
        element={<AuthComponent children={<Event />} isProtected />}
      />
      <Route
        path="teams/:team_id/events/:event_id/edit"
        element={<AuthComponent children={<EditEvent />} isProtected />}
      />
    </Routes>
  );
};
