import { ITime } from './time.interface';

export interface IComment {
  cid: string;
  vid: string;
  uid: string;
  text: string;
  creator: boolean;
  timestamp: ITime;
  likes: Array<string>;
  childrens: Array<IComment>;
  liked: boolean;
}

export interface ICommentProps {
  handleComment: Function;
  comments: Array<IComment>;
  limitComments: number;
  setLimitComments: Function;
}
