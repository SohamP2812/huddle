import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team, Event, Participant, User, LoginCredentials, AccountCreationInfo, TeamInvite, TeamAlbum, TeamImage, Member } from 'utils/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Self', 'Invites', 'Teams', 'Members', 'Events', 'Participants', 'Albums', 'Images'],
  endpoints: (builder) => ({
    getSelf: builder.query<User | null, void>({
      queryFn: async (name, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `session`,
          method: 'GET'
        });

        if (result.error?.status === 403) {
          return { data: null };
        }

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as User };
      },
      providesTags: ['Self']
    }),
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}`
    }),
    login: builder.mutation<User, LoginCredentials>({
      query: (credentials) => ({ url: `session`, method: 'POST', body: credentials }),
      invalidatesTags: ['Self']
    }),
    logout: builder.mutation<string, void>({
      query: () => ({ url: `session`, method: 'DELETE' }),
      invalidatesTags: ['Self', 'Invites', 'Teams', 'Members', 'Events', 'Participants', 'Albums', 'Images']
    }),
    createUser: builder.mutation<User, AccountCreationInfo>({
      query: (newUser) => ({ url: `users`, method: 'POST', body: newUser }),
      invalidatesTags: ['Self']
    }),
    resetPassword: builder.mutation<string, string>({
      query: (email) => ({
        url: `users/password`,
        method: 'DELETE',
        body : { email: email }
      }),
      invalidatesTags: ['Self', 'Teams', 'Events', 'Participants']
    }),
    updatePassword: builder.mutation<string, { token: string, password: string }>({
      query: (resetDetails) => ({ url: `users/password`, method: 'POST', body: resetDetails }),
      invalidatesTags: ['Self']
    }),
    updateUser: builder.mutation<User, { id: number; updatedUser: FormData }>({
      query: ({ id, updatedUser }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: updatedUser,
        // headers: { "Content-Type": "multipart/form-data" }
      }),
      invalidatesTags: ['Self', 'Teams', 'Events', 'Participants']
    }),
    deleteUser: builder.mutation<string, { id: number; password: string }>({
      query: ({id, password}) => ({
        url: `users/${id}`,
        method: 'DELETE',
        body : {password: password}
      }),
      invalidatesTags: ['Self', 'Teams', 'Events', 'Participants']
    }),
    searchUsers: builder.query<{ users: User[] }, string>({
      query: (username) => ({ url: `users`, params: { username: username } })
    }),
    getEvents: builder.query<{ events: Event[] }, number>({
      query: (id) => `teams/${id}/events`,
      providesTags: ['Events']
    }),
    getTeams: builder.query<{ teams: Team[] }, number>({
      query: (id) => `users/${id}/teams`,
      providesTags: ['Teams']
    }),
    deleteTeam: builder.mutation<Team, number>({
      query: (teamId) => ({
        url: `teams/${teamId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Teams']
    }),
    getMembers: builder.query<{ members: Member[] }, number>({
      query: (id) => `teams/${id}/members`,
      providesTags: ['Members']
    }),
    addMember: builder.mutation<Member, { teamId: number; addedUserId: number }>({
      query: ({ teamId, addedUserId }) => ({
        url: `teams/${teamId}/members`,
        method: 'POST',
        body: { id: addedUserId }
      }),
      invalidatesTags: ['Members']
    }),
    deleteMember: builder.mutation<Member, { userId: number; teamId: number }>({
      query: ({ userId, teamId }) => ({
        url: `teams/${teamId}/members/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Members', 'Teams']
    }),
    updateMember: builder.mutation<Member, { userId: number; teamId: number, updatedMember: Partial<Member> }>({
      query: ({ userId, teamId, updatedMember }) => ({
        url: `teams/${teamId}/members/${userId}`,
        method: 'PATCH',
        body: updatedMember
      }),
      invalidatesTags: ['Members']
    }),
    createTeam: builder.mutation<Team, Partial<Team>>({
      query: (createdTeam) => ({
        url: `teams`,
        method: 'POST',
        body: createdTeam
      }),
      invalidatesTags: ['Teams']
    }),
    getParticipants: builder.query<
      { eventParticipants: Participant[] },
      { teamId: number; eventId: number }
    >({
      query: ({ teamId, eventId }) => `teams/${teamId}/events/${eventId}/participants`,
      providesTags: ['Participants']
    }),
    updateParticipant: builder.mutation<
      Participant,
      {
        teamId: number;
        eventId: number;
        userId: number;
        updatedParticipant: Partial<Participant>;
      }
    >({
      query: ({ teamId, eventId, userId, updatedParticipant }) => ({
        url: `teams/${teamId}/events/${eventId}/participants/${userId}`,
        method: 'PATCH',
        body: updatedParticipant
      }),
      invalidatesTags: ['Participants']
    }),
    updateEvent: builder.mutation<
      Event,
      {
        teamId: number;
        eventId: number;
        updatedEvent: Partial<Event> & { participantIds: number[] };
      }
    >({
      query: ({ teamId, eventId, updatedEvent }) => ({
        url: `teams/${teamId}/events/${eventId}`,
        method: 'PATCH',
        body: updatedEvent
      }),
      invalidatesTags: ['Events', 'Participants']
    }),
    createEvent: builder.mutation<
      Event,
      {
        teamId: number;
        createdEvent: Partial<Event> & { participantIds: number[] };
      }
    >({
      query: ({ teamId, createdEvent }) => ({
        url: `teams/${teamId}/events`,
        method: 'POST',
        body: createdEvent
      }),
      invalidatesTags: ['Events', 'Participants']
    }),
    getInvites: builder.query<
      {invites: TeamInvite[]},
      string
    >({
      query: (email) => ({
        url: `invites?email=${email}`,
        method: 'GET',
      }), 
      providesTags: ['Invites']
    }), 
    createInvite: builder.mutation<
      TeamInvite,
      {
        teamId: number,
        email: string
      }
    >({
      query: (createdInvite) => ({
        url: `invites`,
        method: 'POST',
        body: createdInvite
      }), 
      invalidatesTags: ['Invites']
    }),
    updateInvite: builder.mutation<
      TeamInvite,
      { 
        inviteToken: string,
        state: string
        position: string
      }
    >({
      query: ({ inviteToken, state, position }) => ({
        url: `invites/${inviteToken}`,
        method: 'PATCH',
        body: {
          state: state,
          position: position
        }
      }),
      invalidatesTags: ['Invites', 'Teams', 'Events', 'Participants']
    }),
    deleteEvent: builder.mutation<Event, { teamId: number; eventId: number }>({
      query: ({ teamId, eventId }) => ({
        url: `teams/${teamId}/events/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Events']
    }),
    createAlbum: builder.mutation<
      TeamAlbum,
      {
        teamId: number
        createdAlbum: Partial<TeamAlbum>
      }
    >({
      query: ({ teamId, createdAlbum }) => ({
        url: `teams/${teamId}/albums`,
        method: 'POST',
        body: createdAlbum
      }), 
      invalidatesTags: ['Albums']
    }),
    getAlbums: builder.query<
      { albums: TeamAlbum[] },
      number
    >({
      query: (teamId) => ({
        url: `teams/${teamId}/albums`,
        method: 'GET',
      }), 
      providesTags: ['Albums']
    }), 
    createImage: builder.mutation<
      TeamImage,
      {
        teamId: number,
        albumId: number,
        image: FormData
      }
    >({
      query: ({ teamId, albumId, image }) => ({
        url: `teams/${teamId}/albums/${albumId}/images`,
        method: 'POST',
        body: image
      }), 
      invalidatesTags: ['Images']
    }),
    getImages: builder.query<
      { images: TeamImage[] },
      { teamId: number, albumId: number }
    >({
      query: ({ teamId, albumId }) => ({
        url: `teams/${teamId}/albums/${albumId}/images`,
        method: 'GET',
      }), 
      providesTags: ['Images']
    }), 
  })
});

export const {
  useGetSelfQuery,
  useGetUserQuery,
  useLoginMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutMutation,
  useCreateUserMutation,
  useSearchUsersQuery,
  useGetEventsQuery,
  useGetMembersQuery,
  useAddMemberMutation,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
  useCreateTeamMutation,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useGetParticipantsQuery,
  useUpdateParticipantMutation,
  useUpdateEventMutation,
  useCreateEventMutation,
  useGetInvitesQuery, 
  useCreateInviteMutation,
  useUpdateInviteMutation,
  useDeleteEventMutation,
  useCreateAlbumMutation,
  useGetAlbumsQuery,
  useCreateImageMutation, 
  useGetImagesQuery
} = apiSlice;
