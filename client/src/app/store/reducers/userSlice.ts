import { createSlice } from "@reduxjs/toolkit";
import localStorageService from "../../service/localStorage.service";
import { IUserData } from "../../types/types";
import { getUserData, signIn, signUp } from "../actions/authUserActions";

interface InitialState {
  auth: string | null;
  user: IUserData;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: InitialState = localStorageService.getUserId()
  ? {
      auth: localStorageService.getUserId(),
      user: {} as IUserData,
      isLoggedIn: true,
      isLoading: true,
      error: "",
    }
  : {
      auth: null,
      user: {} as IUserData,
      isLoggedIn: false,
      isLoading: false,
      error: "",
    };

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.auth = localStorageService.getUserId();
      state.user = action.payload;
    });

    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = typeof action.payload === "string" ? action.payload : "";
    });

    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.auth = localStorageService.getUserId();
      state.isLoggedIn = true;
      state.user = action.payload;
    });

    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = typeof action.payload === "string" ? action.payload : "";
    });

    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });

    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === "string" ? action.payload : "";
    });
  },
});

const { reducer: authReducer } = authSlice;

export default authReducer;
