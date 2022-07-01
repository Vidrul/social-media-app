import { createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../../service/chat.service";
import { createErrorMessage } from "../../utils/helper";

const conversationActions = {
  CONVERSATION_CREATE: "conversation/CONVERSATION_CREATE",
};

export const createConversation = createAsyncThunk(
  conversationActions.CONVERSATION_CREATE,
  async (payload: string, { rejectWithValue }) => {
    try {
      const { data } = await chatService.createConversations(payload);
      return data;
    } catch (error: any) {
      const message = createErrorMessage(error.message);
      return rejectWithValue(message);
    }
  }
);
