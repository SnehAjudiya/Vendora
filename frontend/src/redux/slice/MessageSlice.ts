import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createMessagesApi, fetchMessagesApi } from "../../api/messagesApi";

type MessageValues = {
  roomId: string | null;
  senderId: string | null;
  senderName: string | null;
  text: string;
  isRead: boolean;
};

interface MessageState {
  messages: MessageValues[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "/messages/fetchMessages",
  fetchMessagesApi,
);

export const createMessages = createAsyncThunk(
  "/messages/createMessages",
  createMessagesApi,
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // on message
    receivedMessage: (state, action: PayloadAction<MessageValues>) => {
      state.messages.push(action.payload);
    },

    // on reading message
    readMessages: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.map((m) => {
        if (m.senderId === action.payload && m.isRead === false)
          m.isRead = true;
        return m;
      });
    },
  },

  // these are from async redux calls
  extraReducers: (builder) => {
    builder

      // fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchMessages.fulfilled,
        (state, action: PayloadAction<MessageValues[]>) => {
          state.loading = false;
          state.messages = action.payload;
        },
      )
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching messages";
      })

      // create messages
      .addCase(createMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createMessages.fulfilled,
        (state, action: PayloadAction<MessageValues>) => {
          state.loading = false;
          state.messages.push(action.payload);
        },
      )
      .addCase(createMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error creating message";
      });
  },
});

export const { receivedMessage, readMessages } = messageSlice.actions;

export default messageSlice.reducer;
