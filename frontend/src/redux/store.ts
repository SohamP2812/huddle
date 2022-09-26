import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "redux/slices/userSlice";
import teamsReducer from "redux/slices/teamsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    teams: teamsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
