import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface User {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isManager?: boolean;
}

export interface Team {
  id: number;
  name: string;
  manager: User;
  sport: string;
}

export interface Event {
  id: number;
  name: string;
  team: Team;
  startTime: string;
  endTime: string;
  eventType: string;
  teamScore: number;
  opponentScore: number;
}

export interface Participant {
  id: number;
  user: User;
  event: Event;
  attendance: string;
}

export interface TeamsState {
  teams: Team[];
  members: User[]; // Should be in a seperate slice - but treat this as "selected team" members
  events: Event[]; // Should be in a seperate slice - but treat this as "selected team" events
  participants: Participant[];
  error: string | null;
  teamCreationSuccess: boolean | null;
  eventCreationSuccess: boolean | null;
  eventUpdateSuccess: boolean | null;
  memberAddedSuccess: boolean | null;
  memberDeletionSuccess: boolean | null;
  eventDeletionSuccess: boolean | null;
  teamDeletionSuccess: boolean | null;
  message: string | null;
}

export interface TeamCreationInfo {
  name: string;
  sport: string;
}

export interface EventCreationInfo {
  name: string;
  startTime: string;
  endTime: string;
  eventType: string;
  teamScore: number;
  opponentScore: number;
  participantIds: (number | null)[];
}

export interface APIError {
  message: string;
}

const initialState: TeamsState = {
  teams: [],
  members: [],
  events: [],
  participants: [],
  error: null,
  teamCreationSuccess: null,
  eventCreationSuccess: null,
  eventUpdateSuccess: null,
  memberAddedSuccess: null,
  memberDeletionSuccess: null,
  eventDeletionSuccess: null,
  teamDeletionSuccess: null,
  message: null,
};

export const createTeam = createAsyncThunk<
  Team,
  TeamCreationInfo,
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/createTeam",
  async (teamCreationInfo, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(teamCreationInfo),
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const deleteTeam = createAsyncThunk<
  Event,
  number,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("teams/deleteTeam", async (team_id, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/api/teams/${team_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data;
    }

    return data;
  } catch (err) {
    let error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const addMember = createAsyncThunk<
  User,
  { team_id: number; teamMemberInfo: { id: number } },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/addMember",
  async ({ team_id, teamMemberInfo }, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(`/api/teams/${team_id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(teamMemberInfo),
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const getByUser = createAsyncThunk<
  { teams: Team[] },
  number,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("teams/getByUser", async (id, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/api/users/${id}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data;
    }

    return data;
  } catch (err) {
    let error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const getMembers = createAsyncThunk<
  { members: User[] },
  number,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("teams/getMembers", async (id, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/api/teams/${id}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data;
    }

    return data;
  } catch (err) {
    let error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const deleteMember = createAsyncThunk<
  User,
  { user_id: number; team_id: number },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/deleteMember",
  async ({ user_id, team_id }, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(`/api/teams/${team_id}/members/${user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const getEvents = createAsyncThunk<
  { events: Event[] },
  number,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("teams/getEvents", async (id, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/api/teams/${id}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data;
    }

    return data;
  } catch (err) {
    let error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const deleteEvent = createAsyncThunk<
  Event,
  { team_id: number; event_id: number },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/deleteEvent",
  async ({ team_id, event_id }, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(`/api/teams/${team_id}/events/${event_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const createEvent = createAsyncThunk<
  Event,
  { id: number; eventCreationInfo: EventCreationInfo },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/createEvent",
  async ({ id, eventCreationInfo }, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(`/api/teams/${id}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventCreationInfo),
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const updateEvent = createAsyncThunk<
  Event,
  { team_id: number; event_id: number; eventUpdateInfo: EventCreationInfo },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/updateEvent",
  async (
    { team_id, event_id, eventUpdateInfo },
    { rejectWithValue, getState }
  ) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(`/api/teams/${team_id}/events/${event_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventUpdateInfo),
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const getParticipants = createAsyncThunk<
  { eventParticipants: Participant[] },
  { team_id: number; event_id: number },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/getParticipants",
  async ({ team_id, event_id }, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(
        `/api/teams/${team_id}/events/${event_id}/participants`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accepts: "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const updateParticipant = createAsyncThunk<
  Participant,
  {
    team_id: number;
    event_id: number;
    user_id: number;
    participantUpdateInfo: { attendance: string };
  },
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "teams/updateParticipant",
  async (
    { team_id, event_id, user_id, participantUpdateInfo },
    { rejectWithValue, getState }
  ) => {
    try {
      const { loggedIn } = getState().user;

      if (!loggedIn) return;

      const response = await fetch(
        `/api/teams/${team_id}/events/${event_id}/participants/${user_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            accepts: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(participantUpdateInfo),
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        if (data.errors && data.errors.length && response.status === 400) {
          data.message = data.errors[0].defaultMessage;
        }

        throw data;
      }

      return data;
    } catch (err) {
      let error: APIError = err;

      if (!error.message) {
        throw err;
      }

      return rejectWithValue(error);
    }
  }
);

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.error = null;
        state.teamCreationSuccess = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teamCreationSuccess = true;

        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.teamCreationSuccess = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(deleteTeam.pending, (state) => {
        state.error = null;
        state.teamDeletionSuccess = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(
          (team) => team.id !== action.payload.id
        );
        state.message = "Team deleted successfully.";
        state.teamDeletionSuccess = true;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.teamDeletionSuccess = false;
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(getByUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getByUser.fulfilled, (state, action) => {
        state.teams = action.payload.teams;
      })
      .addCase(getByUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(getMembers.pending, (state) => {
        state.error = null;
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.members = action.payload.members;
      })
      .addCase(getMembers.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(deleteMember.pending, (state) => {
        state.error = null;
        state.memberDeletionSuccess = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member.id !== action.payload.id
        );
        state.message = "Member removed successfully.";
        state.memberDeletionSuccess = true;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.memberDeletionSuccess = false;
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(getEvents.pending, (state) => {
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.events = action.payload.events;
      })
      .addCase(getEvents.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(deleteEvent.pending, (state) => {
        state.error = null;
        state.eventDeletionSuccess = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event.id !== action.payload.id
        );
        state.message = "Event deleted successfully.";
        state.eventDeletionSuccess = true;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.eventDeletionSuccess = false;
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(createEvent.pending, (state) => {
        state.error = null;
        state.eventCreationSuccess = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.message = "Event created successfully.";
        state.eventCreationSuccess = true;

        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.eventCreationSuccess = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(updateEvent.pending, (state) => {
        state.error = null;
        state.eventUpdateSuccess = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.message = "Updated successfully.";
        state.eventUpdateSuccess = true;

        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.eventUpdateSuccess = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(getParticipants.pending, (state) => {
        state.error = null;
      })
      .addCase(getParticipants.fulfilled, (state, action) => {
        state.participants = action.payload.eventParticipants;
      })
      .addCase(getParticipants.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(updateParticipant.pending, (state) => {
        state.error = null;
      })
      .addCase(updateParticipant.fulfilled, (state, action) => {
        state.participants = state.participants.map((participant) =>
          participant.id === action.payload.id ? action.payload : participant
        );
      })
      .addCase(updateParticipant.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(addMember.pending, (state) => {
        state.error = null;
        state.memberAddedSuccess = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.message = "Added successfully.";
        state.memberAddedSuccess = true;

        state.members.push(action.payload);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.memberAddedSuccess = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      });
  },
  reducers: {
    resetError: (state) => {
      state.error = "";
    },
    clearTeamState: (state) => {
      state = initialState;
    },
  },
});

export const selectTeams = (state: RootState): TeamsState => state.teams;

export const selectMembers = (state: RootState): User[] => state.teams.members;

export const selectEvents = (state: RootState): Event[] => state.teams.events;

export const selectParticipants = (state: RootState): Participant[] =>
  state.teams.participants;

export const selectTeamById = (
  state: RootState,
  id?: number
): Team | null | undefined =>
  id ? state.teams.teams.find((team) => team.id === id) : null;

export const selectEventById = (
  state: RootState,
  id?: number
): Event | null | undefined =>
  id ? state.teams.events.find((event) => event.id === id) : null;

export const { resetError, clearTeamState } = teamsSlice.actions;

export default teamsSlice.reducer;
