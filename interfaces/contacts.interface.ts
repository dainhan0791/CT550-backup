import { timeStamp } from 'console';
import { ITime } from './time.interface';

export interface IContact {
  cid: string;
  uid: string;
  content: string;
  status: string;
  timeStamp: ITime;
}
