import { Alert, Avatar, Divider, ListItemIcon, Menu, MenuItem, Skeleton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { INotification } from '../../interfaces/notifications.interface';
import NotiMenuItem from '../items/NotiMenuItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const NotificationsMenu = ({
  anchorEl,
  id,
  open,
  onClose,
  onClick,
  PaperProps,
  transformOrigin,
  anchorOrigin,
  notifications,
  limitNoti,
  setLimitNoti,
  totalNoti,
}: {
  anchorEl: any;
  id: string;
  open: any;
  onClose: any;
  onClick: any;
  PaperProps: object;
  transformOrigin: any;
  anchorOrigin: any;
  notifications: Array<INotification>;
  limitNoti: number;
  setLimitNoti: Function;
  totalNoti: number;
}) => {
  const moreNotiData = () => {
    if (limitNoti && setLimitNoti) {
      setTimeout(() => {
        setLimitNoti((limitNoti: number) => limitNoti + 8);
      }, 500);
    }
  };

  return (
    <SCMenu
      anchorEl={anchorEl}
      id="box-notification"
      open={open}
      onClose={onClose}
      onClick={onClose}
      PaperProps={PaperProps}
      transformOrigin={transformOrigin}
      anchorOrigin={anchorOrigin}
    >
      {notifications.length && (
        <InfiniteScroll
          next={moreNotiData}
          dataLength={notifications.length}
          scrollableTarget="box-notification"
          hasMore={limitNoti <= totalNoti}
          loader={<Skeleton height={200} style={{ transform: 'none' }} variant="rectangular" />}
          height={500}
          endMessage={''}
        >
          {notifications.map((noti: INotification) => (
            <NotiMenuItem key={noti.nid} {...noti} />
          ))}
        </InfiniteScroll>
      )}
    </SCMenu>
  );
};
const SCMenu = styled(Menu)`
  .css-6hp17o-MuiList-root-MuiMenu-list {
    max-height: 500px !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
`;

export default NotificationsMenu;
