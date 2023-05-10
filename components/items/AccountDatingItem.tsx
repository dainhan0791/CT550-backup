import React from 'react';
import { Avatar, Chip, List, ListItem, ListItemAvatar, ImageList, ImageListItem } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TelegramIcon from '@mui/icons-material/Telegram';
import PersonIcon from '@mui/icons-material/Person';

import { Check } from '@mui/icons-material';

import styled from 'styled-components';
import { IAccountItem, IDatingItem } from '../../interfaces/account.interface';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter, displayName, displayTall } from '../../utils/display';

import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { setTargetConversation } from '../../redux/slices/chat.slice';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { guid } from '../../utils/generates';
import { useSnackbar } from 'notistack';
import { IMessage } from '../../interfaces/chat.interface';

const SCAccountItemWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 345px;
  background: #f5f5f5;
  margin-bottom: 0.5rem;
`;
const SCListItem = styled(ListItem)`
  min-width: 300px;
  align-items: flex-start;
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
  width: 2.8rem !important;
  height: 2.8rem !important;
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
  font-size: 0.78rem;
  display: inline-block;
  line-height: 28px;
  color: rgba(22, 24, 35, 0.75);
`;

const SCHorizotal = styled.div`
  display: flex;
  align-items: center;
`;

const SCVertical = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  margin-top: 0.5rem;
`;

const SCFavoriteBorderIcon = styled(FavoriteBorderIcon)`
  margin-left: auto;
  &:hover {
    color: rgba(255, 44, 85, 1);
  }
`;

const SCFavoriteIcon = styled(FavoriteIcon)`
  margin-left: auto;
  color: #ff69b4;
`;

const SCSendIcon = styled(TelegramIcon)`
  margin-left: auto;
  &:hover {
    color: rgba(255, 44, 85, 1);
  }
`;

const SCItem = styled.div`
  font-size: 0.8rem;
  color: blue;
`;

const SCMoreInfoWrap = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 0.3rem;
  margin-top: 0.2rem;
`;

const SCChip = styled(Chip)`
  font-size: 0.7rem !important;
  height: 100% !important;
`;

const AccountDatingItem = (props: IAccountItem) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const profile = useAppSelector((state) => state.account.profile);
  const [memberCurrentChat, setMembersCurrentChat] = React.useState<Array<string>>([]);

  const dispatch = useAppDispatch();

  // const handleTargetAccount = (account: IAccountItem) => {
  //   if (account && props.conversationId) {
  //     dispatch(
  //       setTargetConversation({
  //         acountTarget: account,
  //         cid: props.conversationId,
  //       }),
  //     );
  //   }
  // };

  const handleLike = async (event: any, account: IAccountItem) => {
    event.stopPropagation();

    if (profile && account) {
      profile.inviteDating?.forEach((item: string) => {
        if (item === account.uid) {
          enqueueSnackbar('You invited this account.');
        }
      });

      const nid = guid();

      const userRef = doc(fStore, 'users', profile.uid);
      const userTarget = doc(fStore, 'users', account.uid);

      try {
        await updateDoc(userRef, {
          inviteDating: arrayUnion(account.uid),
        });

        await updateDoc(userTarget, {
          invitedDating: arrayUnion(profile.uid),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    const getMemberCurrentChat = async () => {
      try {
        if (profile) {
          const q = query(collection(fStore, 'conversations'), where('members', 'array-contains', profile.uid));
          const querySnapshot = await getDocs(q);
          let data: Array<string> = [];
          querySnapshot.forEach((doc) => {
            doc.data().members.forEach((member: string) => {
              if (member !== profile.uid) {
                data.push(member);
              }
            });
          });
          setMembersCurrentChat(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMemberCurrentChat();
  }, []);

  const handleSendMessageDating = async (event: any, account: IAccountItem) => {
    event.stopPropagation();

    try {
      if (!profile) return;
      if (!account) return;
      if (!props.handleCloseDatingDialog) return;

      const conversationId = guid();

      const senderId = profile.uid;
      const reciverId = account.uid;

      if (memberCurrentChat.includes(props.uid)) {
        props.handleCloseDatingDialog();

        router.push('/messages');
      } else {
        const conversationRef = doc(fStore, 'conversations', conversationId);

        const senderMessageItem: IMessage = {
          senderId: senderId,
          text: `Hi! ${account.name}, Nice to meet you! ❤️`,
          timestamp: Date.now(),
        };

        const receiverMessageItem: IMessage = {
          senderId: reciverId,
          text: `Hi! ${profile.name}, Nice to meet you too! 💜`,
          timestamp: Date.now(),
        };

        await setDoc(conversationRef, {
          cid: conversationId,
          timestamp: serverTimestamp(),
          members: arrayUnion(senderId, reciverId),
          messages: [senderMessageItem, receiverMessageItem],
          totalMessages: 0,
        });

        await setDoc(doc(fStore, 'notifications', senderId), {
          nid: senderId,
          isRead: false,
          senderId: senderId,
          receiverId: reciverId,
          timestamp: serverTimestamp(),
          type: 'dating',
        });

        await setDoc(doc(fStore, 'notifications', reciverId), {
          nid: reciverId,
          isRead: false,
          senderId: reciverId,
          receiverId: senderId,
          timestamp: serverTimestamp(),
          type: 'dating',
        });

        props.handleCloseDatingDialog();

        router.push('/messages');

        dispatch(
          setTargetConversation({
            acountTarget: account,
            cid: conversationId,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SCAccountItemWrapper>
      {props && (
        <List>
          <SCListItem>
            <ListItemAvatar>
              <SCAvatar src={props.photoURL} />
            </ListItemAvatar>
            <SCListBodyItem>
              <SCAccountHeadItem style={{ flexDirection: 'column' }}>
                <SCNameWrapper>
                  <SCName style={{ fontSize: '0.9rem', lineHeight: '1.2rem' }}>{props.nickname}</SCName>

                  {/* <SCName style={{ fontSize: '0.9rem', lineHeight: '1.2rem' }}>
                    {displayName(props.name, props.uid)}
                  </SCName>
                  <SCSubName style={{ lineHeight: '1.2rem' }}>{props.nickname}</SCSubName> */}
                  {props.tick && <SCCheckIcon />}
                </SCNameWrapper>
              </SCAccountHeadItem>
              {props.tall && <SCItem>Height: {displayTall(props.tall)}</SCItem>}
              {props.sex && <SCItem>Sex: {capitalizeFirstLetter(props.sex)}</SCItem>}
            </SCListBodyItem>

            {props.isMatch ? (
              <SCSendIcon onClick={(event: any) => handleSendMessageDating(event, props)} />
            ) : (
              <>
                {profile && profile.inviteDating?.includes(props.uid) ? (
                  <SCFavoriteIcon />
                ) : (
                  <SCFavoriteBorderIcon onClick={(event: any) => handleLike(event, props)} />
                )}
              </>
            )}
          </SCListItem>
          <SCVertical>
            <h5>Favorites:</h5>
            <SCMoreInfoWrap>
              {props.favorites?.length &&
                props.favorites.map((favorite: string) => (
                  <>
                    <SCChip
                      label={capitalizeFirstLetter(favorite)}
                      key={favorite}
                      variant="outlined"
                      onDelete={() => {}}
                      deleteIcon={<GradeIcon style={{ color: '#7CFC00', fontSize: '0.9rem' }} />}
                    />
                  </>
                ))}
            </SCMoreInfoWrap>
          </SCVertical>

          <SCVertical>
            <h5>Targets:</h5>
            <SCMoreInfoWrap>
              {props.targets?.length &&
                props.targets.map((targets: string) => (
                  <>
                    <SCChip
                      label={capitalizeFirstLetter(targets)}
                      key={targets}
                      variant="outlined"
                      onDelete={() => {}}
                      deleteIcon={<PersonIcon style={{ color: '#FFA500', fontSize: '0.9rem' }} />}
                    />
                  </>
                ))}
            </SCMoreInfoWrap>
          </SCVertical>

          <SCVertical>
            <h5>Images:</h5>
            <SCMoreInfoWrap>
              {props?.datingImages?.length ? (
                <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
                  {props.datingImages.map((url: string) => (
                    <ImageListItem key={url}>
                      <Avatar src={url} sx={{ width: '100%', height: '100%' }} variant="rounded" />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                ''
              )}
            </SCMoreInfoWrap>
          </SCVertical>
        </List>
      )}
    </SCAccountItemWrapper>
  );
};

export default AccountDatingItem;
