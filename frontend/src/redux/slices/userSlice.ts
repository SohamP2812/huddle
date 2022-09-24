import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  loggedIn: boolean;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  loggedIn: false,
};

export const getSelf = createAsyncThunk<
  UserState,
  void,
  {
    state: RootState;
  }
>("user/getSelf", async (_, { getState, rejectWithValue }) => {
  try {
    const { loggedIn } = getState().user;

    if (loggedIn) return;

    const response = await fetch("/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginCredentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch("/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginCredentials),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loggedIn = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loggedIn = false;
      });
  },
  reducers: {},
});

export const selectLoggedIn = (state: RootState): boolean =>
  state.user.loggedIn;

export default userSlice.reducer;
