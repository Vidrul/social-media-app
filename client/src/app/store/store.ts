import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";

const rootReducer = combineReducers({
  authUser: authReducer,
});

export function setUpStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setUpStore>;
export type AppDispatch = AppStore["dispatch"];
