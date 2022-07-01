import httpService from "./http.service";

const chatService = {
  createConversations: async (receiverId: string) => {
    try {
      const { data } = await httpService.post("conversation/", { receiverId });

      return data as {
        code: number;
        data: {
          id: string;
          members: string[];
        };
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getConversations: async () => {
    try {
      const { data } = await httpService.get("conversation/");

      return data as {
        code: number;
        conversations: {
          id: string;
          members: string[];
        }[];
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  getMessages: async (conversationId: string | null) => {
    try {
      const { data } = await httpService.get("message/" + conversationId);

      return data as {
        code: number;
        messages: {
          id: number;
          sender: number;
          text: string;
          create_date: string;
        }[];
      };
    } catch (error: any) {
      throw error.response.data;
    }
  },

  createMessage: async (payload: {
    text: string | null;
    conversationId: string | null;
  }) => {
    try {
      const { data } = await httpService.post("message/", payload);
      return data as any;
    } catch (error: any) {
      throw error.response.data;
    }
  },
};

export default chatService;
