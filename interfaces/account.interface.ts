import { ITime } from './time.interface';
export interface IIsVideoProps {
  isvideo: boolean;
}

export interface IAuth {
  isLogin: boolean;
}
export interface IAccountSlice {
  profile: IAccountItem | null;
  accounts: Array<IAccountItem>;
  account: IAccountItem | null;
  names: Array<string>;
  suggestedAccounts: Array<IAccountItem>;
  followingAccounts: Array<IAccountItem>;
  followingAccountsView: Array<IAccountItem>;
}

export interface IDatingItem {
  uid: string;
  isMath: boolean;
}

export interface IAccountItem {
  uid: string;
  phoneNumber?: string;
  name: string;
  nickname: string;
  email: string;
  photoURL: string;
  tick: boolean;
  country?: string;
  noAccentName?: string;
  tall?: string;
  sex?: string;
  followers: Array<string>;
  following?: Array<string>;
  favorites?: Array<string>;
  targets?: Array<string>;
  datingImages?: Array<string>;
  inviteDating?: Array<string>;
  invitedDating?: Array<string>;
  likes?: Array<string>;
  timestamp?: ITime;
  timestampUpdate?: ITime;
  conversationId?: string;
  isMatch?: boolean;
  totalProducts?: number;
  totalOrder?: number;

  handleFollow?: Function;

  handleCloseDatingDialog?: Function;
}

export interface IAccountCommentItem {
  uid: string;
  name: string;
  photoURL: string;
  tick: boolean;
}
export interface IAccountNotiItem {
  uid: string;
  name: string;
  nickname: string;
  timestamp: ITime;
  photoURL: string;
  tick: boolean;
  type: string;
  roomId?: string;
}
export interface IAccountVideoItem {
  uid: string;
  name: string;
  nickname: string;
  photoURL: string;
  desc: string;
  tick: boolean;
  timestamp?: ITime;
  handleFollow: Function;
}
export interface IAccountDetailsVideoItem {
  uid: string;
  name: string;
  nickname: string;
  photoURL: string;
  desc: string;
  tick: boolean;
  timestamp: ITime;
  handleFollow: Function;
}

export interface ICountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}
