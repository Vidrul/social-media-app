import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createConversation } from "../actions/conversationActions";

interface InitialState {
  currentConversation: {
    id: string;
    members: string[];
  } | null;
  isLoading: boolean;
  error: string;
}

const initialState: InitialState = {
  currentConversation: null,
  isLoading: false,
  error: "",
};

const сonversationSlice = createSlice({
  name: "сonversation",
  initialState: initialState,
  reducers: {
    setConversation(
      state,
      action: PayloadAction<{
        id: string;
        members: string[];
      }>
    ) {
      if (action.payload.id !== state.currentConversation?.id)
        state.currentConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createConversation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createConversation.fulfilled, (state, action) => {
      state.currentConversation = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createConversation.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isLoading = false;
    });
  },
});

const { reducer: сonversationReducer, actions } = сonversationSlice;
export const { setConversation } = actions;

export default сonversationReducer;
