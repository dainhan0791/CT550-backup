import { ICart } from '../interfaces/shop.interface';

export const toUpperCaseFirstLetter = (myString: string, delimiter: string) => {
  if (!myString) {
    return '';
  }
  let strings = myString.split(delimiter);
  for (let i = 0; i < strings.length; i++) {
    strings[i] = strings[i].charAt(0).toUpperCase() + strings[i].slice(1);
  }
  return strings.join(' ');
};

export const displayK = (number: number) => {
  if (number === 0) {
    return 0;
  }

  if (number < 1000) {
    return number;
  }

  if (number >= 1000 && number < 1000000) {
    return `${number / 1000}k`;
  }

  if (number >= 1000000) {
    return `${number / 1000000}m`;
  }
};

export const displayName = (name: string, uid: string) => {
  if (name) {
    return name;
  } else {
    return uid.slice(0, 10);
  }
};

export const displaySeeAll = (isSeeAll: boolean) => {
  if (!isSeeAll) {
    return 'See All';
  } else {
    return 'Hide';
  }
};

export const displayTall = (tall: string) => {
  if (tall) {
    const result = Number(tall) / 100;
    return `${result}m`;
  }
};

export const capitalizeFirstLetter = (str: string) => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

export const displayPrice = (price: number) => {
  if (price) {
    return `${displayK(price)} $`;
  }
};

export const displayQuantity = (quantity: number) => {
  if (quantity >= 0) {
    return `Quantity: ${quantity}`;
  } else {
    return ``;
  }
};

export const calculateTotaPriceCart = (cart: Array<ICart>) => {
  const initialValue = 0;

  if (cart.length) {
    return cart.reduce(
      (accumulator: number, currentValue: ICart) => accumulator + currentValue.price * currentValue.quantity,
      initialValue,
    );
  } else {
    return 0;
  }
};

export const getArrayProductIdInCart = (cart: Array<ICart>) => {
  if (cart.length) {
    return cart.map((cart: ICart) => cart.pid);
  } else {
    return [];
  }
};

export const displayTotalOrder = (order: number) => {
  if (order) {
    return `Total Order: ${order} order`;
  } else {
    return `Total Order: 0 order`;
  }
};
