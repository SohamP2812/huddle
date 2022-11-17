import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

import ReactGA from 'react-ga';

export interface User {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

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
  user: User;
  loggedIn: boolean | null;
  error: string | null;
  message: string | null;
  queryUsers: User[];
}

export interface APIError {
  message: string;
}

const initialState: UserState = {
  user: {
    id: null,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    createdAt: ''
  },
  loggedIn: null,
  error: null,
  message: null,
  queryUsers: []
};

export const getUsersByQuery = createAsyncThunk<
  { users: User[] },
  string,
  {
    state: RootState;
    rejectValue: APIError;
  }
>('user/getUsersByQuery', async (username, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/users?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data; // Should I be throwing some object instance (new Error())?
    }

    return data;
  } catch (err) {
    const error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const getSelf = createAsyncThunk<
  User,
  void,
  {
    state: RootState;
    rejectValue: APIError;
  }
>('user/getSelf', async (_, { getState, rejectWithValue }) => {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data; // Should I be throwing some object instance (new Error())?
    }

    return data;
  } catch (err) {
    const error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const login = createAsyncThunk<
  User,
  LoginCredentials,
  {
    state: RootState;
    rejectValue: APIError;
  }
>('user/login', async (loginCredentials, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (loggedIn) return;

    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(loginCredentials)
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
    const error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const createAccount = createAsyncThunk<
  User,
  AccountCreationInfo,
  {
    state: RootState;
    rejectValue: APIError;
  }
>('user/createAccount', async (accountCreationInfo, { rejectWithValue, getState }) => {
  try {
    const { loggedIn } = getState().user;

    if (loggedIn) return;

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(accountCreationInfo)
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
    const error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const updateUser = createAsyncThunk<
  User,
  UserUpdateInfo,
  {
    state: RootState;
    rejectValue: APIError;
  }
>('user/updateUser', async (userUpdateInfo, { rejectWithValue, getState }) => {
  try {
    const {
      loggedIn,
      user: { id }
    } = getState().user;

    if (!loggedIn) return;

    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userUpdateInfo)
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
    const error: APIError = err;

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
>('user/logout', async (_, { getState, rejectWithValue }) => {
  try {
    const { loggedIn } = getState().user;

    if (!loggedIn) return;

    const response = await fetch('/api/session', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        accepts: 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.status !== 200) {
      if (data.errors && data.errors.length && response.status === 400) {
        data.message = data.errors[0].defaultMessage;
      }

      throw data;
    }

    return data.message;
  } catch (err) {
    const error: APIError = err;

    if (!error.message) {
      throw err;
    }

    return rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loggedIn = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message ?? 'An unknown error occurred. Please try again.';
        }
      })
      .addCase(createAccount.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.user = action.payload;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loggedIn = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message ?? 'An unknown error occurred. Please try again.';
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.message = 'Updated successfully.';

        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message ?? 'An unknown error occurred. Please try again.';
        }
      })
      .addCase(getSelf.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(getSelf.fulfilled, (state, action) => {
        state.loggedIn = true;

        state.user = action.payload;

        ReactGA.set({ userId: action.payload.id });
      })
      .addCase(getSelf.rejected, (state) => {
        state.loggedIn = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loggedIn = false;

        state.user = {
          id: null,
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          createdAt: ''
        };
      })
      .addCase(logout.rejected, (state, action) => {
        state.loggedIn = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message ?? 'An unknown error occurred. Please try again.';
        }
      })
      .addCase(getUsersByQuery.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(getUsersByQuery.fulfilled, (state, action) => {
        state.queryUsers = action.payload.users;
      })
      .addCase(getUsersByQuery.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message ?? 'An unknown error occurred. Please try again.';
        }
      });
  },
  reducers: {
    resetError: (state) => {
      state.error = '';
    },
    resetUserQuery: (state) => {
      state.queryUsers = [];
    },
    clearUserState: (state) => {
      state = { ...initialState, loggedIn: state.loggedIn };
    }
  }
});

export const selectUser = (state: RootState): UserState => state.user;

export const { resetError, resetUserQuery, clearUserState } = userSlice.actions;

export default userSlice.reducer;
