import { ITime } from './time.interface';
export interface ICurrentVideo {
  video: IVideoItem | null;
}

export interface IVideoItem {
  uid: string;
  vid: string;
  desc: string;
  hashtag: string;
  url: string;
  timestamp?: ITime;
  likes: Array<string>;
  comments: number;
  shares: Array<string>;
  views: Array<string>;
}
export interface IVideoDetailsItem {
  uid: string;
  vid: string;
  desc: string;
  hashtag: string;
  url: string;
  timestamp: ITime;
  likes: Array<string>;
  comments: number;
  shares: Array<string>;
  views: Array<string>;
}
export interface IVideo {
  uid: string;
  vid: string;
  url: string;
  hashtag: string;
  likes: Array<string>;
  comments: number;
  shares: Array<string>;
  liked: boolean;
  handleLike?: Function;
  goToDetailsVideo?: Function;
  handleShare?: Function;
  name?: string;
  views: Array<string>;
}

export interface IVideoActions {
  views: Array<string>;
  likes: Array<string>;
  comments: number;
  shares: Array<string>;
  handleLike: Function;
  handleOpenShareDialog: Function;
  liked: boolean;
}
