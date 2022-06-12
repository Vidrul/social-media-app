import { createSlice } from "@reduxjs/toolkit";
import localStorageService from "../../service/localStorage.service";
import { IUserData } from "../../types/types";
import {
  followOrUnfollowToUser,
  getUserData,
  signIn,
  signUp,
} from "../actions/authUserActions";

interface InitialState {
  auth: string | null;
  data: IUserData;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: InitialState = localStorageService.getUserId()
  ? {
      auth: localStorageService.getUserId(),
      data: {} as IUserData,
      isLoggedIn: true,
      isLoading: true,
      error: "",
    }
  : {
      auth: null,
      data: {} as IUserData,
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
      state.data = action.payload;
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
      state.data = action.payload;
    });

    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = typeof action.payload === "string" ? action.payload : "";
    });

    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });

    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === "string" ? action.payload : "";
    });

    builder.addCase(followOrUnfollowToUser.fulfilled, (state, action) => {
      if (!state.data.followings.includes(action.payload.userId)) {
        state.data.followings.push(action.payload.userId);
      } else {
        state.data.followings = state.data.followings.filter(
          (userId) => userId !== action.payload.userId
        );
      }
    });

    builder.addCase(followOrUnfollowToUser.rejected, (state, action) => {
      state.error = typeof action.payload === "string" ? action.payload : "";
    });
  },
});

const { reducer: authReducer } = authSlice;

export default authReducer;
