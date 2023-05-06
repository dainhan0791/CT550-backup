import { IConfigs, IConfigSlice } from '../../interfaces/config.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

const initialState: IConfigSlice = {
  config: null,
};

export const configSlice = createSlice({
  name: 'config',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setConfigApp: (state, action: PayloadAction<IConfigs>) => {
      state.config = action.payload;
    },
  },
});

export const { setConfigApp } = configSlice.actions;

export default configSlice.reducer;
