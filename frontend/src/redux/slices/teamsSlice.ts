import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
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

export interface TeamsState {
  teams: Team[];
  members: User[]; // Should be in a seperate slice - but treat this as "selected team" members
  events: Event[];
  error: string | null;
  teamCreationSuccess: boolean | null;
  eventCreationSuccess: boolean | null;
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
  participantIds: number[];
}

export interface APIError {
  message: string;
}

const initialState: TeamsState = {
  teams: [],
  members: [],
  events: [],
  error: null,
  teamCreationSuccess: null,
  eventCreationSuccess: null,
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

      const response = await fetch("/teams", {
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

    const response = await fetch(`/users/${id}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
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

    const response = await fetch(`/teams/${id}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
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

    const response = await fetch(`/teams/${id}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
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

      const response = await fetch(`/teams/${id}/events`, {
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
      .addCase(createEvent.pending, (state) => {
        state.error = null;
        state.eventCreationSuccess = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
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
      });
  },
  reducers: {
    resetError: (state) => {
      state.error = "";
    },
  },
});

export const selectTeams = (state: RootState): TeamsState => state.teams;

export const selectMembers = (state: RootState): User[] => state.teams.members;

export const selectEvents = (state: RootState): Event[] => state.teams.events;

export const selectTeamById = (
  state: RootState,
  id?: number
): Team | null | undefined =>
  id ? state.teams.teams.find((team) => team.id === id) : null;

export const { resetError } = teamsSlice.actions;

export default teamsSlice.reducer;
