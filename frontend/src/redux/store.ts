import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "redux/slices/userSlice";
import teamReducer from "redux/slices/teamSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    team: teamReducer,
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
