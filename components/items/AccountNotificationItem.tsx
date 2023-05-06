import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, Button } from '@mui/material';
import { Check, FavoriteBorder, Favorite } from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

import { IAccountCommentItem, IAccountItem, IAccountNotiItem, IIsVideoProps } from '../../interfaces/account.interface';
import { fAuth, fStore } from '../../firebase/init.firebase';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useRouter } from 'next/router';
import { IComment } from '../../interfaces/comment.interface';
import { useSnackbar } from 'notistack';
import { displayName } from '../../utils/display';
import { INotification } from '../../interfaces/notifications.interface';
import DatingDialog from '../dialogs/DatingDialog';

const SCAccountItemWrapper = styled.div`
  padding: 0;
`;
const SCAccountHeadItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-top: 0.4rem;
`;
const SCName = styled.p`
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SCList = styled(List)`
  padding: 0px !important;
`;

const SCAvatar = styled(Avatar)`
  width: 3rem !important;
  height: 3rem !important;
  cursor: pointer;
`;

const SCListBodyItem = styled.div`
  width: 100%;
  margin-left: -0.4rem;
`;

const SCWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;
const SCContactWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  width: 0.9rem !important;
  height: 0.9rem !important;
  border-radius: 50%;
  color: white;
`;

const SCTime = styled.div`
  font-size: 0.83rem;
  margin-top: 0.2rem;
`;

const SCText = styled.p`
  font-size: 0.9rem;
`;

const SCButtonJoinRoom = styled(Button)`
  margin-left: 1rem !important;
`;

const AccountNotificationItem = (props: IAccountNotiItem) => {
  const router = useRouter();

  const displayNotiText = (type: string) => {
    switch (type) {
      case 'follow':
        return 'is following you';
      case 'like':
        return 'like your video';
      case 'dating':
        return 'want to chat with you';
      case 'call':
        return 'want to call video with you';
      default:
        break;
    }
  };

  const handleClickNoti = () => {
    if (props.type !== 'call') {
      if (props?.name !== undefined) router.push(`@${props?.name}`);
    }
  };

  const handleJoinRoom = () => {
    if (props.roomId) {
      router.push(`/call/${props.roomId}`);
    }
  };

  return (
    <SCAccountItemWrapper onClick={handleClickNoti}>
      <SCList>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <SCAvatar src={props?.photoURL} />
          </ListItemAvatar>
          <SCListBodyItem>
            <SCAccountHeadItem>
              <SCWrapper>
                <SCName>
                  {displayName(props?.name || '', props?.uid || '')} {props?.tick && <SCCheckIcon />}
                </SCName>
                <SCText>{displayNotiText(props.type)}</SCText>
              </SCWrapper>

              <SCContactWrapper>
                {props.timestamp && <SCTime> {moment(props.timestamp.seconds * 1000).fromNow()}</SCTime>}

                {props.type === 'call' && (
                  <SCButtonJoinRoom variant="contained" size="small" onClick={handleJoinRoom}>
                    Join Room
                  </SCButtonJoinRoom>
                )}
              </SCContactWrapper>
            </SCAccountHeadItem>
          </SCListBodyItem>
        </ListItem>
      </SCList>
    </SCAccountItemWrapper>
  );
};

export default AccountNotificationItem;
