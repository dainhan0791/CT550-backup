import { IFooterItem } from './common.interface';
import { IDiscoverItem } from './discover.interface';

export interface IConfigSlice {
  config: IConfigs | null;
}

export interface IConfigRes {
  Array: IConfigs;
}

export interface IConfigs {
  hashtags: Array<IDiscoverItem>;
  footerItems: Array<IFooterItem>;
  favoriteItems: Array<ILabelValue>;
  targetItems: Array<ILabelValue>;
  // footer: Array<IFooterItem>;
}

export interface ILabelValue {
  value: string;
  label: string;
}
