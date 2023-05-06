import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { IAccountItem } from '../../interfaces/account.interface';
import { INotification } from '../../interfaces/notifications.interface';
import { useAppSelector } from '../../redux/hooks/hooks';
import AccountNotificationItem from './AccountNotificationItem';

const SCMenuItem = styled(MenuItem)`
  padding: 0 !important;
  width: 360px;
  overflow-x: hidden;
`;
const NotiMenuItem = (props: INotification) => {
  const accounts = useAppSelector((state) => state.account.accounts);

  const account = accounts.find((acc: IAccountItem) => acc.uid === props.senderId);

  return (
    <SCMenuItem>
      {account && (
        <AccountNotificationItem
          uid={account.uid}
          name={account.name}
          nickname={account.nickname}
          photoURL={account.photoURL}
          tick={account.tick}
          type={props.type}
          timestamp={props.timestamp}
          roomId={props.rid}
        />
      )}
    </SCMenuItem>
  );
};

export default NotiMenuItem;
