import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

export interface TeamState {
  id: number | null;
  name: string;
  sport: "BASKETBALL" | "HOCKEY";
  error: string | null;
}

export interface TeamCreationInfo {
  name: string;
  sport: "BASKETBALL" | "HOCKEY";
}

export interface APIError {
  message: string;
}

const initialState: TeamState = {
  id: null,
  name: "",
  sport: "BASKETBALL",
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
  "user/createTeam",
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

export const teamSlice = createSlice({
  name: "team",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.sport = action.payload.sport;
      })
      .addCase(createTeam.rejected, (state, action) => {
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

export const selectTeam = (state: RootState): TeamState => state.team;

export const { resetError } = teamSlice.actions;

export default teamSlice.reducer;
