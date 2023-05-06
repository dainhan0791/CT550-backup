import { ITime } from './time.interface';
export interface INotification {
  nid: string;
  isRead: boolean;
  receiverId: string;
  senderId: string;
  type: string;
  vid?: string;
  rid?: string;
  timestamp: ITime;
}
