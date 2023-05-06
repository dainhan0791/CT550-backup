import { ICart } from '../interfaces/shop.interface';

export const addToCartCache = (cart: Array<ICart>) => {
  if (cart) {
    return localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const getCartCache = () => {
  const result = localStorage.getItem('cart');

  if (result) {
    return JSON.parse(result) as Array<ICart>;
  } else {
    return [];
  }
};

export const clearCartCache = () => {
  return localStorage.removeItem('cart');
};
