import { IAccountSlice, IAccountItem } from './../../interfaces/account.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: IAccountSlice = {
  profile: null,
  accounts: [],
  account: null,
  names: [],
  suggestedAccounts: [],
  followingAccounts: [],
  followingAccountsView: [],
};

export const accountSlice = createSlice({
  name: 'account',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IAccountItem>) => {
      if (!action.payload) return;
      state.profile = action.payload;

      const followingAccounts = state.accounts.filter((account: IAccountItem) =>
        state.profile?.following?.includes(account.uid),
      );

      state.followingAccounts = followingAccounts;
      state.followingAccountsView = followingAccounts.slice(0, 5);
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    setAccounts: (state, action: PayloadAction<Array<IAccountItem>>) => {
      state.accounts = action.payload;

      const suggestedData = action.payload.sort(
        (a: IAccountItem, b: IAccountItem) => b?.followers?.length - a?.followers?.length,
      );

      state.suggestedAccounts = suggestedData.slice(0, 5);

      const arrNames: Array<string> = [];
      action.payload.forEach((item: IAccountItem) => arrNames.push(item.name));

      state.names = arrNames;
    },

    seeAllSuggestedAccounts: (state) => {
      const suggestedData = state.accounts.sort(
        (a: IAccountItem, b: IAccountItem) => b?.followers?.length - a?.followers?.length,
      );
      state.suggestedAccounts = suggestedData.slice(0, 20);
    },
    hideSuggestedAccounts: (state) => {
      const suggestedData = state.accounts.sort(
        (a: IAccountItem, b: IAccountItem) => b?.followers?.length - a?.followers?.length,
      );
      state.suggestedAccounts = suggestedData.slice(0, 5);
    },

    seeAllFollowingAccounts: (state) => {
      state.followingAccountsView = state.followingAccounts;
    },
    hideFollowingAccounts: (state) => {
      state.followingAccountsView = state.followingAccounts.slice(0, 5);
    },
  },
});

export const {
  setProfile,
  clearProfile,
  setAccounts,
  seeAllSuggestedAccounts,
  hideSuggestedAccounts,
  seeAllFollowingAccounts,
  hideFollowingAccounts,
} = accountSlice.actions;

export default accountSlice.reducer;
