import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import accountReducer from './slices/account.slice';
import feedsReducer from './slices/feeds.slice';
import chatReducer from './slices/chat.slice';
import configReducer from './slices/config.slice';
import shopReducer from './slices/shop.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    configApp: configReducer,
    account: accountReducer,
    feeds: feedsReducer,
    chat: chatReducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
