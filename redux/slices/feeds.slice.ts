import { IVideoItem } from '../../interfaces/video.interface';
import { IFeeds } from './../../interfaces/feeds.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: IFeeds = {
  videos: [],
};

export const feedsSlice = createSlice({
  name: 'feeds',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFeeds: (state, action: PayloadAction<IFeeds>) => {
      state.videos = action.payload.videos;
    },
  },
});

export const { setFeeds } = feedsSlice.actions;

export default feedsSlice.reducer;
