import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import axios from "axios";

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

export const loginUser = createAsyncThunk(
  "counter/loginUser",
  async (loginCredentials: LoginCredentials, thunkAPI) => {
    try {
      let cookies = document.cookie;
      console.log(cookies);
      const resp = await fetch("/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginCredentials),
      });
      const data = await resp.json();

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response);
        return thunkAPI.rejectWithValue(error.response);
      } else {
        console.log(error);
      }
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
