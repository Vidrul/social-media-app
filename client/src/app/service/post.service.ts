import httpService from "./http.service";
import localStorageService from "./localStorage.service";

const postService = {
  createPost: async (payload: { desc: string; img: string | null }) => {
    try {
      const { data } = await httpService.post("post/", {
        userId: localStorageService.getUserId(),
        ...payload,
      });

      return data;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  removePost: async (postId: string) => {
    try {
      const { data } = await httpService.remove("post/" + postId);
      return data;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  likePost: async (postId: string) => {
    try {
      const { data } = await httpService.update(`post/${postId}/like`);
      return data;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getAllUserPosts: async (userId: string) => {
    try {
      const { data } = await httpService.get("post/profile/" + userId);

      return data as {
        code: number;
        posts: {
          id: number;
          userId: number;
          desc: string;
          img: string;
          likes: [];
          create_date: string;
        }[];
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getAllUserAndFollowingsPosts: async () => {
    try {
      const { data } = await httpService.get("/post/timeline/all");

      return data as {
        code: number;
        posts: {
          id: number;
          userId: number;
          desc: string;
          img: string;
          likes: [];
          create_date: string;
        }[];
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },
};

export default postService;
