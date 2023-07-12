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
import { User } from 'components/User/User';
import { CreateAlbum } from 'components/CreateAlbum/CreateAlbum';
import { CreateImage } from 'components/CreateImage/CreateImage';
import { Album } from 'components/Album/Album';

import { useAnalytics } from 'hooks/useAnalytics';
import { TeamInvite } from 'components/TeamInvite/TeamInvite';
import { TeamInvites } from 'components/TeamInvites/TeamInvites';
import { ScrollToTop } from 'components/ScrollToTop/ScrollToTop';

export const App: FC = () => {
  useAnalytics();

  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<AuthComponent children={<LandingPage />} />} />
        <Route path="sign-up" element={<AuthComponent children={<SignUp />} />} />
        <Route path="sign-in" element={<AuthComponent children={<SignIn />} />} />
        <Route path="account" element={<AuthComponent children={<Account />} isProtected />} />
        <Route path="account" element={<AuthComponent children={<Account />} isProtected />} />
        <Route path="users/:user_id" element={<AuthComponent children={<User />} isProtected />} />
        <Route
          path="create-team"
          element={<AuthComponent children={<CreateTeam />} isProtected />}
        />
        <Route path="invites" element={<AuthComponent children={<TeamInvites />} isProtected />} />
        <Route
          path="invites/:invite_token"
          element={<AuthComponent children={<TeamInvite />} isProtected />}
        />
        <Route path="teams" element={<AuthComponent children={<Teams />} isProtected />} />
        <Route path="teams/:team_id" element={<AuthComponent children={<Team />} isProtected />} />
        <Route
          path="teams/:team_id/create-album"
          element={<AuthComponent children={<CreateAlbum />} isProtected />}
        />
        <Route
          path="teams/:team_id/albums/:album_id"
          element={<AuthComponent children={<Album />} isProtected />}
        />
        <Route
          path="teams/:team_id/albums/:album_id/create-image"
          element={<AuthComponent children={<CreateImage />} isProtected />}
        />
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
    </ScrollToTop>
  );
};
