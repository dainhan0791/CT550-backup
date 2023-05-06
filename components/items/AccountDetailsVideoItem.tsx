import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar } from '@mui/material';
import { Check, AccessTime } from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

import { IAccountItem, IAccountDetailsVideoItem, IIsVideoProps } from '../../interfaces/account.interface';
import { fAuth, fStore } from '../../firebase/init.firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useRouter } from 'next/router';

const SCAccountItemWrapper = styled.div``;
const SCAccountHeadItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 430px;
  margin-top: 0.4rem;
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
  margin-top: 0.3rem;
`;

const SCAvatar = styled(Avatar)`
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const SCListBodyItem = styled.div`
  margin-left: 1rem;
`;

const SCNameWrapper = styled.div``;

const SCWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SCSubNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SCSubName = styled.p`
  font-family: 'IBM Plex Sans', ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  font-weight: bold;
`;
const SCTimer = styled.p`
  font-size: 0.83rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;
const SCDescriptionVideo = styled.p`
  font-size: 1rem;
  line-height: 22px;
  font-weight: 400;
  word-wrap: break-word;
  width: 100%;
  margin-top: 1rem;
  margin-left: 0.1rem;
`;
const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  width: 0.9rem !important;
  height: 0.9rem !important;
  border-radius: 50%;
  color: white;
`;
const SCButtonFollow = styled.button`
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  color: rgb(254, 44, 85);
  border-color: rgb(254, 44, 85);
  background-color: rgb(255, 255, 255);
  height: 30px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  min-width: 120px;
  padding: 0px 10px;
  &:hover {
    background-color: rgba(254, 44, 85, 0.06);
  }
`;
const SCButtonFollowed = styled(SCButtonFollow)`
  opacity: 0.4;
  cursor: auto;
`;
const SCCreator = styled.div`
  font-size: 0.9rem;
  color: rgb(254, 44, 85);
  font-weight: bold;
`;
const AccountDetailsVideoItem = (props: IAccountDetailsVideoItem) => {
  const router = useRouter();

  const profile = useAppSelector((state) => state.account.profile);

  const followed = profile?.following?.includes(props.uid);

  const onHandleFollow = () => {
    if (props.handleFollow) {
      props.handleFollow();
    }
  };
  const goToUserPage = () => {
    router.push(`/@${props.name}`);
  };

  return (
    <SCAccountItemWrapper>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar onClick={goToUserPage}>
            <SCAvatar src={props.photoURL} />
          </ListItemAvatar>
          <SCListBodyItem>
            <SCAccountHeadItem>
              <SCNameWrapper>
                <SCWrapper>
                  <SCName>{props.name}</SCName>
                  {props.tick && <SCCheckIcon />}
                </SCWrapper>

                <SCSubNameWrapper>
                  <SCSubName>{props.nickname}.</SCSubName>
                  <SCTimer>
                    {moment(props.timestamp.seconds * 1000).fromNow()}
                    <AccessTime sx={{ width: '14px', height: '14px' }} />
                  </SCTimer>
                </SCSubNameWrapper>
              </SCNameWrapper>
              {profile && profile.uid === props.uid ? (
                <SCCreator>Creator</SCCreator>
              ) : (
                <>
                  {followed ? (
                    <SCButtonFollowed disabled>Followed</SCButtonFollowed>
                  ) : (
                    <SCButtonFollow onClick={onHandleFollow}>Follow</SCButtonFollow>
                  )}
                </>
              )}
            </SCAccountHeadItem>
          </SCListBodyItem>
        </ListItem>
        <ListItem alignItems="flex-start">
          <SCDescriptionVideo>{props.desc}</SCDescriptionVideo>
        </ListItem>
      </List>
    </SCAccountItemWrapper>
  );
};

export default AccountDetailsVideoItem;
