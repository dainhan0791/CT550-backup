import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar } from '@mui/material';
import { Check, FavoriteBorder, Favorite } from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

import { IAccountCommentItem, IAccountItem, IIsVideoProps } from '../../interfaces/account.interface';
import { fAuth, fStore } from '../../firebase/init.firebase';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks/hooks';
import { IComment } from '../../interfaces/comment.interface';
import { useSnackbar } from 'notistack';
import { displayName } from '../../utils/display';

const SCAccountItemWrapper = styled.div``;

const SCAccountHeadItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-top: 0.4rem;
  gap: 0.3rem;
`;
const SCName = styled.p`
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  max-width: 280px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 0.3rem;
`;

const SCCreator = styled.div`
  font-size: 0.9rem;
  color: rgb(254, 44, 85);
  font-weight: bold;
  margin-top: 0.2rem;
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
  width: 100%;
  display: flex;
  align-items: center;
`;

const SCWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;
const SCContactWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const SCContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  width: 400px;
`;

const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  width: 0.9rem !important;
  height: 0.9rem !important;
  border-radius: 50%;
  color: white;
`;
const SCText = styled.p`
  max-width: 85%;
  word-wrap: break-word;
  font-size: 0.9rem;
  overflow: hidden;
  font-family: 'IBM Plex Sans', ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
`;
const SCTime = styled.div`
  font-size: 0.83rem;
`;
const SCReplay = styled.div`
  font-size: 0.83rem;
  color: rgb(254, 44, 85);
  cursor: pointer;
  opacity: 0.8;
`;
const SCLoveIconWrapper = styled.div`
  cursor: pointer;
  text-align: center;

  &:hover {
    opacity: 0.8;
  }
`;
const SCLikes = styled.div`
  font-size: 0.9rem;
`;

const AccountCommentItem = (props: IComment) => {
  const profile = useAppSelector((state) => state.account.profile);
  const accounts = useAppSelector((state) => state.account.accounts);

  const { enqueueSnackbar } = useSnackbar();
  const account = accounts.find((acc: IAccountItem) => acc.uid === props.uid);

  const handleLikeComment = async () => {
    try {
      if (props.cid && profile) {
        const commentRef = doc(fStore, 'comments', props.cid);
        if (props.liked) {
          await updateDoc(commentRef, {
            likes: arrayRemove(profile.uid),
          });
          enqueueSnackbar(`UnLike successfully`, { variant: 'success' });
        } else {
          await updateDoc(commentRef, {
            likes: arrayUnion(profile.uid),
          });
          enqueueSnackbar(`Like successfully`, { variant: 'success' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SCAccountItemWrapper>
      <List>
        <ListItem alignItems="flex-start" sx={{ padding: '0px 0.4rem' }}>
          <ListItemAvatar>
            <SCAvatar src={account?.photoURL} />
          </ListItemAvatar>
          <SCListBodyItem>
            <SCAccountHeadItem>
              <SCWrapper>
                <SCName>{displayName(account?.name || '', account?.uid || '')}</SCName>

                {account?.tick && <SCCheckIcon />}

                {props.creator && <SCCreator>Creator</SCCreator>}
              </SCWrapper>
              <SCContentWrapper>
                <SCText>{props.text}</SCText>
              </SCContentWrapper>

              <SCContactWrapper>
                {props.timestamp && <SCTime> {moment(props.timestamp.seconds * 1000).fromNow()}</SCTime>}
                {/* <SCReplay>Replay</SCReplay> */}
              </SCContactWrapper>
            </SCAccountHeadItem>
            <SCLoveIconWrapper onClick={handleLikeComment}>
              {props.liked ? <Favorite sx={{ color: 'rgb(254, 44, 85)' }} /> : <FavoriteBorder />}
              <SCLikes>{props.likes.length}</SCLikes>
            </SCLoveIconWrapper>
          </SCListBodyItem>
        </ListItem>
      </List>
    </SCAccountItemWrapper>
  );
};

export default AccountCommentItem;
