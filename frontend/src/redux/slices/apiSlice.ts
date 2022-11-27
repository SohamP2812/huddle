import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team, Event, Participant, User, LoginCredentials, AccountCreationInfo } from 'utils/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Self', 'Teams', 'Members', 'Events', 'Participants'],
  endpoints: (builder) => ({
    getSelf: builder.query<User | null, void>({
      queryFn: async (name, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `session`,
          method: 'GET'
        });

        if (result.error?.status === 401) {
          return { data: null };
        }

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as User };
      },
      providesTags: ['Self']
    }),
    login: builder.mutation<User, LoginCredentials>({
      query: (credentials) => ({ url: `session`, method: 'POST', body: credentials }),
      invalidatesTags: ['Self']
    }),
    logout: builder.mutation<string, void>({
      query: () => ({ url: `session`, method: 'DELETE' }),
      invalidatesTags: ['Self']
    }),
    createUser: builder.mutation<User, AccountCreationInfo>({
      query: (newUser) => ({ url: `users`, method: 'POST', body: newUser }),
      invalidatesTags: ['Self']
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...updatedUser }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: updatedUser
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
    getMembers: builder.query<{ members: User[] }, number>({
      query: (id) => `teams/${id}/members`,
      providesTags: ['Members']
    }),
    addMember: builder.mutation<User, { teamId: number; addedUserId: number }>({
      query: ({ teamId, addedUserId }) => ({
        url: `teams/${teamId}/members`,
        method: 'POST',
        body: { id: addedUserId }
      }),
      invalidatesTags: ['Members']
    }),
    deleteMember: builder.mutation<User, { userId: number; teamId: number }>({
      query: ({ userId, teamId }) => ({
        url: `teams/${teamId}/members/${userId}`,
        method: 'DELETE'
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
    deleteEvent: builder.mutation<Event, { teamId: number; eventId: number }>({
      query: ({ teamId, eventId }) => ({
        url: `teams/${teamId}/events/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Events']
    })
  })
});

export const {
  useGetSelfQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useLogoutMutation,
  useCreateUserMutation,
  useSearchUsersQuery,
  useGetEventsQuery,
  useGetMembersQuery,
  useAddMemberMutation,
  useDeleteMemberMutation,
  useCreateTeamMutation,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useGetParticipantsQuery,
  useUpdateParticipantMutation,
  useUpdateEventMutation,
  useCreateEventMutation,
  useDeleteEventMutation
} = apiSlice;
