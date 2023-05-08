import React from 'react';
import { Avatar, Link, List, ListItem, ListItemAvatar, IconButton, Tooltip, Divider } from '@mui/material';

import { Check, MoreHoriz, Try } from '@mui/icons-material';

import styled from 'styled-components';
import { IAccountItem } from '../../interfaces/account.interface';
import { useRouter } from 'next/router';
import { displayK, displayName } from '../../utils/display';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { fStore } from '../../firebase/init.firebase';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { guid } from '../../utils/generates';
import { useSnackbar } from 'notistack';
import { isArrayLiteralExpression } from 'typescript';
import { IVideoItem } from '../../interfaces/video.interface';
import PersonalAccountMenu from '../menus/PersonalAccountMenu';
import { EChatRole } from '../../enums/chat.enum';
import ShareDialog from '../dialogs/ShareDialog';

import { setTargetConversation } from '../../redux/slices/chat.slice';
import Axios from 'axios';

const SCAccountItemWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;
`;
const SCListItem = styled(ListItem)`
  display: flex;
  gap: 1rem;
  align-items: flex-start !important;
`;
const SCAccountHeadItem = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SCName = styled.p`
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 1.2rem;
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
  width: 5.4rem !important;
  height: 5.4rem !important;
`;

const SCListBodyItem = styled.div`
  margin-left: 0rem;
  margin-right: 11rem;
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
  margin-top: 0.3rem;
`;

const SCSubName = styled.p`
  font-family: ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  margin-top: 0.2rem;
  display: inline-block;
  line-height: 28px;
  color: rgba(22, 24, 35, 0.75);
`;
const SCButtonFollow = styled.button`
  margin-top: 1rem;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  color: #fff;
  border-color: rgb(254, 44, 85);
  background-color: rgb(254, 44, 85);
  min-height: 34px;
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  font-family: ProximaNova, PingFangSC, sans-serif;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  right: 0px;
  top: 28px;
  min-width: 170px;
  padding: 0px 10px;
  &:hover {
    background-color: rgba(254, 44, 85, 0.06);
    color: black;
  }
`;
const SCButtonFollowed = styled(SCButtonFollow)``;

const SCSocial = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;

const SCSocialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
`;

const AccountPersonalItem = (props: IAccountItem) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const feeds = useAppSelector((state) => state.feeds.videos);
  const profile = useAppSelector((state) => state.account.profile);
  const followed = profile?.following?.includes(props.uid);
  const isPersonal = profile?.uid === props.uid;

  const [memberCurrentChat, setMembersCurrentChat] = React.useState<Array<string>>([]);

  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);

  const [openShareDialog, setOpenShareDialog] = React.useState<boolean>(false);

  const open = Boolean(anchorElMenu);

  // handle open menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleFollow = async () => {
    try {
      if (fStore && profile && props) {
        const userRef = doc(fStore, 'users', props.uid);
        const currentUserRef = doc(fStore, 'users', profile.uid);

        const cid = guid();
        const notificationsRef = doc(fStore, 'notifications', cid);

        if (props.uid !== profile.uid) {
          await updateDoc(userRef, {
            followers: arrayUnion(profile.uid),
          });
          await updateDoc(currentUserRef, {
            following: arrayUnion(props.uid),
          });

          await setDoc(notificationsRef, {
            nid: cid,
            senderId: profile.uid,
            receiverId: props.uid,
            type: 'follow',
            isRead: false,
            timestamp: serverTimestamp(),
          });

          await Axios.post(
            `${process.env.NEXT_PUBLIC_NEO4J_API}/user/friends/follow/${profile.uid}`,
            {
              id: props.uid,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          enqueueSnackbar(`Follow success.`, { variant: 'success' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (fStore && profile && props) {
        const userRef = doc(fStore, 'users', props.uid);
        const currentUserRef = doc(fStore, 'users', profile.uid);

        if (props.uid !== profile.uid) {
          await updateDoc(userRef, {
            followers: arrayRemove(profile.uid),
          });
          await updateDoc(currentUserRef, {
            following: arrayRemove(props.uid),
          });

          await Axios.post(
            `${process.env.NEXT_PUBLIC_NEO4J_API}/user/friends/unfollow/${profile.uid}`,
            {
              id: props.uid,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          enqueueSnackbar(`UnFollow success.`, { variant: 'success' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!profile) return;

      if (followed) {
        const conversationId = guid();
        const senderId = profile.uid;
        const reciverId = props.uid;

        if (memberCurrentChat.includes(props.uid)) {
          router.push('/messages');
        } else {
          const conversationRef = doc(fStore, 'conversations', conversationId);

          await setDoc(conversationRef, {
            cid: conversationId,
            timestamp: serverTimestamp(),
            members: arrayUnion(senderId, reciverId),
            messages: [],
            totalMessages: 0,
          });

          router.push('/messages');

          dispatch(
            setTargetConversation({
              acountTarget: props,
              cid: conversationId,
            }),
          );
        }
      } else {
        enqueueSnackbar(`You must follow ${props.name} to send message `, {
          variant: 'info',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };
  const handleShareAccount = () => {
    setOpenShareDialog(true);
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

  return (
    <>
      <ShareDialog open={openShareDialog} handleClose={handleCloseShareDialog} url={window.location.href} />
      {props && (
        <SCAccountItemWrapper>
          <List>
            <SCListItem>
              <ListItemAvatar>
                <SCAvatar src={props.photoURL} />
              </ListItemAvatar>
              <SCListBodyItem>
                <SCAccountHeadItem style={{ flexDirection: 'column' }}>
                  <SCNameWrapper>
                    <SCName>{displayName(props.name, props.uid)}</SCName>
                    {props.tick && <SCCheckIcon />}
                  </SCNameWrapper>
                  <SCSubName style={{ lineHeight: '1.2rem' }}>{props.nickname}</SCSubName>

                  {isPersonal ? (
                    ''
                  ) : (
                    <>
                      {followed ? (
                        <SCButtonFollowed onClick={handleUnfollow}>Un Follow</SCButtonFollowed>
                      ) : (
                        <SCButtonFollow onClick={handleFollow}>Follow</SCButtonFollow>
                      )}
                    </>
                  )}
                </SCAccountHeadItem>
              </SCListBodyItem>

              <Tooltip title="Menu">
                <IconButton
                  onClick={handleOpenMenu}
                  size="small"
                  aria-controls={open ? 'personal-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <MoreHoriz />
                </IconButton>
              </Tooltip>

              <PersonalAccountMenu
                isPersonal={isPersonal}
                handleSendMessage={handleSendMessage}
                handleShareAccount={handleShareAccount}
                anchorEl={anchorElMenu}
                id="personal-menu"
                open={open}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              />
            </SCListItem>
            <SCSocial>
              <SCSocialItem>
                <b>{displayK(props.following?.length || 0)}</b>
                <p>Following</p>
              </SCSocialItem>
              <SCSocialItem>
                <b>{displayK(props.followers?.length || 0)}</b>
                <p>Followers</p>
              </SCSocialItem>
              <SCSocialItem>
                <b>{displayK(props.likes?.length || 0)}</b>
                <p>Likes</p>
              </SCSocialItem>
            </SCSocial>
            <SCSocial>
              <SCSocialItem>
                <b>Email:</b>
                <Link href={`mailto:${props.email}`}>{props.email}</Link>
              </SCSocialItem>
            </SCSocial>
          </List>
        </SCAccountItemWrapper>
      )}
    </>
  );
};

export default AccountPersonalItem;
