import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar } from '@mui/material';
import { Check } from '@mui/icons-material';

import styled from 'styled-components';
import { IAccountItem } from '../../interfaces/account.interface';
import { useRouter } from 'next/router';
import { displayName } from '../../utils/display';
import VideocamIcon from '@mui/icons-material/Videocam';
import { guid } from '../../utils/generates';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { profile } from 'console';
import { fStore } from '../../firebase/init.firebase';
import { useAppSelector } from '../../redux/hooks/hooks';

const SCAccountItemWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  margin-bottom: 0.5rem;
`;
const SCListItem = styled(ListItem)`
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: rgba(22, 24, 35, 0.03);
  }
`;
const SCAccountHeadItem = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SCName = styled.p`
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2rem;
  max-width: 260px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  width: 0.9rem !important;
  height: 0.9rem !important;
  border-radius: 50%;
  color: white;
`;

const SCAvatar = styled(Avatar)`
  width: 3.2rem;
  height: 3.2rem;
`;

const SCListBodyItem = styled.div`
  margin-left: 0rem;
`;

const SCNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 25px;
  margin-right: 4px;
`;

const SCSubName = styled.p`
  font-family: ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 400;
  font-size: 1.15rem;
  display: inline-block;
  color: rgba(22, 24, 35, 0.75);
`;

const SCVideoIcon = styled(VideocamIcon)`
  margin-left: auto;
`;

const AccountTargetItem = (props: IAccountItem) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);

  const goToUserPage = () => {
    if (!props.name) return;
    router.push(`/@${props.name}`);
  };

  const roomId = guid();
  const notiId = guid();

  const joinRoom = () => {
    router.push(`/call/${roomId}`);
  };

  const createRoomNoti = async () => {
    if (!profile) return;

    try {
      await setDoc(doc(fStore, 'notifications', notiId), {
        nid: notiId,
        rid: roomId,
        senderId: profile.uid,
        receiverId: props.uid,
        type: 'call',
        timestamp: serverTimestamp(),
        isRead: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCallVideo = () => {
    joinRoom();
    createRoomNoti();
  };

  return (
    <SCAccountItemWrapper>
      <List sx={{ padding: '0px' }}>
        <SCListItem>
          <ListItemAvatar>
            <SCAvatar src={props.photoURL} onClick={goToUserPage} />
          </ListItemAvatar>
          <SCListBodyItem>
            <SCAccountHeadItem style={{ flexDirection: 'column' }}>
              <SCNameWrapper>
                <SCName style={{ fontSize: '1.4rem' }}>{displayName(props.name, props.uid)}</SCName>
                {props.tick && <SCCheckIcon />}
              </SCNameWrapper>
              <SCSubName>@{props.nickname}</SCSubName>
            </SCAccountHeadItem>
          </SCListBodyItem>
          <SCVideoIcon onClick={handleCallVideo} />
        </SCListItem>
      </List>
    </SCAccountItemWrapper>
  );
};

export default AccountTargetItem;
