import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserUpdateInfo {
  firstName: string;
  lastName: string;
}

export interface AccountCreationInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserState {
  id: number | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  loggedIn: boolean | null;
  error: string | null;
  message: string | null;
}

export interface APIError {
  message: string;
}

const initialState: UserState = {
  id: null,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  loggedIn: null,
  error: null,
  message: null,
};

export const getSelf = createAsyncThunk<
  UserState,
  void,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("user/getSelf", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await fetch("/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw data; // Should I be throwing some object instance (new Error())?
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

export const login = createAsyncThunk<
  UserState,
  LoginCredentials,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("user/login", async (loginCredentials, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (loggedIn) return;

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

export const createAccount = createAsyncThunk<
  UserState,
  AccountCreationInfo,
  {
    state: RootState;
    rejectValue: APIError;
  }
>(
  "user/createAccount",
  async (accountCreationInfo, { rejectWithValue, getState }) => {
    try {
      const { loggedIn } = getState().user;

      if (loggedIn) return;

      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accepts: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(accountCreationInfo),
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

export const updateUser = createAsyncThunk<
  UserState,
  UserUpdateInfo,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("user/updateUser", async (userUpdateInfo, { rejectWithValue, getState }) => {
  try {
    const { loggedIn, id } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accepts: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userUpdateInfo),
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

export const logout = createAsyncThunk<
  string,
  void,
  {
    state: RootState;
    rejectValue: APIError;
  }
>("user/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch("/session", {
      method: "DELETE",
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

    return data.message;
  } catch (err) {
    let error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(login.rejected, (state, action) => {
        state.loggedIn = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(createAccount.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loggedIn = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.message = "Updated successfully.";

        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            action.error.message ??
            "An unknown error occurred. Please try again.";
        }
      })
      .addCase(getSelf.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(getSelf.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(getSelf.rejected, (state) => {
        state.loggedIn = false;
      })
      .addCase(logout.pending, (state) => {})
      .addCase(logout.fulfilled, (state, action) => {
        state.loggedIn = false;

        state.firstName = "";
        state.lastName = "";
        state.username = "";
        state.email = "";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loggedIn = false;

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

export const selectUser = (state: RootState): UserState => state.user;

export const { resetError } = userSlice.actions;

export default userSlice.reducer;
