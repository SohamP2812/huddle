import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../redux/store";
import axios from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserState {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  loggedIn: boolean;
  response: any;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  loggedIn: false,
  response: {},
};

export const loginUser = createAsyncThunk(
  "counter/loginUser",
  async (loginCredentials: LoginCredentials, thunkAPI) => {
    try {
      const response = await axios.post("/session", loginCredentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response);
        return thunkAPI.rejectWithValue(error.response);
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
        state.response = action.payload;
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
