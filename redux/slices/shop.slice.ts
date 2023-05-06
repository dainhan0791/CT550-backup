import { ICart, IProduct } from '../../interfaces/shop.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

interface IShopSlice {
  cart: Array<IProduct>;
}

const initialState: IShopSlice = {
  cart: [],
};

export const shopSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCartRedux: (state, action: PayloadAction<Array<ICart>>) => {
      state.cart = action.payload;
    },
    clearCartRedux: (state) => {
      state.cart = [];
    },
  },
});

export const { setCartRedux, clearCartRedux } = shopSlice.actions;

export default shopSlice.reducer;
