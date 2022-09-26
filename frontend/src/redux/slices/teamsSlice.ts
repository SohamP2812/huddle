import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface TeamState {
  id: number;
  name: string;
  manager: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sport: string;
}

export interface TeamsState {
  teams: TeamState[];
  error: string | null;
}

export interface TeamCreationInfo {
  name: string;
  sport: string;
}

export interface APIError {
  message: string;
}

const initialState: TeamsState = {
  teams: [],
  error: null,
};

export const createTeam = createAsyncThunk<
  TeamState,
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
  { teams: TeamState[] },
  number,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("teams/getByUser", async (id, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`users/${id}/teams`, {
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

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        const newTeam: TeamState = {
          id: action.payload.id,
          name: action.payload.name,
          manager: action.payload.manager,
          sport: action.payload.sport,
        };

        state.teams.push(newTeam);
      })
      .addCase(createTeam.rejected, (state, action) => {
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
      });
  },
  reducers: {
    resetError: (state) => {
      state.error = "";
    },
  },
});

export const selectTeams = (state: RootState): TeamsState => state.teams;

export const { resetError } = teamsSlice.actions;

export default teamsSlice.reducer;
