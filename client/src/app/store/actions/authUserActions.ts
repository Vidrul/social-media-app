import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../service/auth.service";
import localStorageService from "../../service/localStorage.service";
import userService from "../../service/user.service";
import { IPayloadLogin, IPayloadSignUp } from "../../types/types";
import { createErrorMessage } from "../../utils/helper";

const authActions = {
  USER_SIGN_UP: "user/USER_SIGN_UP",
  USER_SIGN_IN: "user/USER_SIGN_IN",
  FETCH_USER_DATA: "user/FETCH_USER_DATA",
  FOLLOW_OR_UNFOLLOW_TOUSER: "user/FOLLOW_TO_USER",
  UPDATE_USER: "user/UPDATE_USER",
};

export const signUp = createAsyncThunk(
  authActions.USER_SIGN_UP,
  async (payload: IPayloadSignUp, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(payload);
      localStorageService.setTokens(data);
      const user = await userService.getAuthUser();

      return user;
    } catch (error: any) {
      const message = createErrorMessage(error.message);
      return rejectWithValue(message);
    }
  }
);

export const signIn = createAsyncThunk(
  authActions.USER_SIGN_IN,
  async (payload: IPayloadLogin, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      localStorageService.setTokens(data);
      const user = await userService.getAuthUser();

      return user;
    } catch (error: any) {
      const message = createErrorMessage(error.message);

      return rejectWithValue(message);
    }
  }
);

export const getUserData = createAsyncThunk(
  authActions.FETCH_USER_DATA,
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getAuthUser();
      return user;
    } catch (error: any) {
      const message = createErrorMessage(error.message);
      return rejectWithValue(message);
    }
  }
);

export const followOrUnfollowToUser = createAsyncThunk(
  authActions.FOLLOW_OR_UNFOLLOW_TOUSER,
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const data = await userService.followOrUnfollowToUser(userId);
      return { ...data, userId };
    } catch (error: any) {
      const message = createErrorMessage(error.message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  authActions.UPDATE_USER,
  async (
    payloda: {
      firstName: string;
      lastName: string;
      city: string;
      from: string;
      profilePicture: string;
      coverPicture: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await userService.updateUser(payloda);
      return data;
    } catch (error: any) {
      const message = createErrorMessage(error.message);
      return rejectWithValue(message);
    }
  }
);
