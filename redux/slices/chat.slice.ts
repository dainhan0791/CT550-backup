import { IAccountItem } from '../../interfaces/account.interface';
import { IChatSlice, IConversation } from '../../interfaces/chat.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

const initialState: IChatSlice = {
  acountTarget: null,
  cid: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTargetConversation: (state, action: PayloadAction<IChatSlice>) => {
      state.acountTarget = action.payload.acountTarget;
      state.cid = action.payload.cid;
    },
  },
});

export const { setTargetConversation } = chatSlice.actions;

export default chatSlice.reducer;
