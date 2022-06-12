import { IPayloadSignUp, IUserData } from "../types/types";
import httpService from "./http.service";
import localStorageService from "./localStorage.service";

const userService = {
  getAuthUser: async (): Promise<IUserData> => {
    try {
      const { data } = await httpService.get(
        "user/" + localStorageService.getUserId()
      );

      return data as IUserData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getUser: async (userId: string): Promise<IUserData> => {
    try {
      const { data } = await httpService.get("user/" + userId);

      return data as IUserData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getUsers: async (
    name: string
  ): Promise<{ code: number; data: IUserData[] }> => {
    try {
      const { data } = await httpService.get("user/searchUsers/" + name);

      return data as { code: number; data: IUserData[] };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getFollowings: async (payload: string) => {
    try {
      const { data } = await httpService.get("user/followings/" + payload);

      return data as {
        code: number;
        array: { id: number; username: string; profilePicture: "" }[];
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  followOrUnfollowToUser: async (userId: string) => {
    try {
      const { data } = await httpService.update(
        "user/followOrUnfollow/" + userId
      );
      return data as {
        code: number;
        message: string;
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  updateUser: async (payload: {
    firstName: string;
    lastName: string;
    city: string;
    from: string;
    profilePicture: string;
    coverPicture: string;
  }) => {
    try {
      const { data } = await httpService.update("user", payload);
      return data as {
        code: number;
        message: string;
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },
};

export default userService;
