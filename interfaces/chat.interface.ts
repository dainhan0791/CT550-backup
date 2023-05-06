import { IAccountItem } from './account.interface';
import { ITime } from './time.interface';

export interface IMessage {
  senderId: string;
  text: string;
  timestamp: number;
}

export interface IConversation {
  cid: string;
  timestamp: ITime;
  members: Array<string>;
  messages: Array<IMessage>;
  totalMessages: number;
}

export interface IChatSlice {
  acountTarget: IAccountItem | null;
  cid: string;
}

export interface IMemberItem {
  uid: string;
  cid: string;
  timestamp: ITime;
  targetIndex?: number;
}
