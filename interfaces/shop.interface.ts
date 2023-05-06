import { timeStamp } from 'console';
import { ITime } from './time.interface';

export interface IProduct {
  pid: string;
  uid: string;
  name: string;
  desc: string;
  price: number;
  url: string;
  timestamp: ITime;
}

export interface ICart extends IProduct {
  quantity: number;
}

export interface IOrder {
  oid: string;
  uid: string;
  products: Array<ICart>;
  timestamp: ITime;
  total: number;
  status: string;
  payment: string;
}
