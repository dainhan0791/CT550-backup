import { Divider } from '@mui/material';
import React, { useRef } from 'react';
import styled from 'styled-components';
import Video from '../common/Video';
import { IVideoItem } from '../../interfaces/video.interface';

// firebase
import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { fAuth, fStore } from '../../firebase/init.firebase';
import { useSnackbar } from 'notistack';
import AccountVideoItem from './AccountVideoItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import LogInDialog from '../dialogs/LoginDialog';
import { useRouter } from 'next/router';
import { guid } from '../../utils/generates';
import Feeds from '../shared/Feeds';
import ShareDialog from '../dialogs/ShareDialog';
import Axios from 'axios';

const SCVideoItemWrapper = styled.div`
  scroll-snap-align: start;
  z-index: 3;
  height: 100vh;
  width: 790px;
`;

const VideoItem = (props: IVideoItem) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currentVideoRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const profile = useAppSelector((state) => state.account.profile);
  const accounts = useAppSelector((state) => state.account.accounts);
  const account = accounts.find((acc) => acc.uid === props.uid);

  const url = `${process.env.NEXT_PUBLIC_APPLICATION_URL}/@${account?.name}/video/${props?.vid}`;

  const [openLoginDialog, setOpenLoginDialog] = React.useState<boolean>(false);
  const handleOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };
  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const [openShareDialog, setOpenShareDialog] = React.useState<boolean>(false);

  const handleOpenShareDialog = () => {
    setOpenShareDialog(true);
  };
  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const liked = props.likes.includes(profile?.uid as string);

  const handleFollow = async () => {
    if (!isLogin) {
      handleOpenLoginDialog();
    }

    try {
      if (fStore && profile && props) {
        const userRef = doc(fStore, 'users', props.uid);
        const currentUserRef = doc(fStore, 'users', profile.uid);

        const nid = guid();
        const notificationsRef = doc(fStore, 'notifications', nid);

        if (props.uid !== profile.uid) {
          await updateDoc(userRef, {
            followers: arrayUnion(profile.uid),
          });
          await updateDoc(currentUserRef, {
            following: arrayUnion(props.uid),
          });

          await setDoc(notificationsRef, {
            nid: nid,
            senderId: profile.uid,
            receiverId: props.uid,
            type: 'follow',
            isRead: false,
            timestamp: serverTimestamp(),
          });

          await Axios.post(`${process.env.NEXT_PUBLIC_NEO4J_API}/user/friends/follow/${props.uid}`);

          enqueueSnackbar(`Follow success.`, { variant: 'success' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Follow failed.', { variant: 'error' });
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!isLogin) {
      handleOpenLoginDialog();
    }
    try {
      if (fStore && profile && props) {
        const videoRef = doc(fStore, 'videos', props.vid);
        const userRef = doc(fStore, 'users', props.uid);

        if (!liked) {
          const cid = guid();
          // const notificationsRef = doc(fStore, 'notifications', cid);

          await updateDoc(videoRef, {
            likes: arrayUnion(profile.uid),
          });

          await updateDoc(userRef, {
            likes: arrayUnion(profile.uid),
          });

          // await setDoc(notificationsRef, {
          //   cid: cid,
          //   senderId: profile.uid,
          //   receiverId: props.uid,
          //   vid: props.vid,
          //   type: 'like',
          //   isRead: false,
          //   timestamp: serverTimestamp(),
          // });
          enqueueSnackbar(`Like success.`, { variant: 'success' });
          return;
        } else {
          await updateDoc(videoRef, {
            likes: arrayRemove(profile.uid),
          });
          await updateDoc(userRef, {
            likes: arrayRemove(profile.uid),
          });
          enqueueSnackbar(`Dislike success`, { variant: 'success' });
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToDetailsVideo = () => {
    if (!props && !account) return;
    if (!currentVideoRef) return;

    if (account?.name && props.vid) {
      router.push(`/@${account?.name}/video/${props.vid}`, undefined, { shallow: true });
    }
  };

  const handleShare = () => {
    handleOpenShareDialog();
  };

  return (
    <SCVideoItemWrapper ref={currentVideoRef} id="videos">
      <LogInDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
      <ShareDialog open={openShareDialog} handleClose={handleCloseShareDialog} url={url} />

      {account && (
        <>
          <AccountVideoItem
            uid={account?.uid}
            name={account?.name}
            nickname={account?.nickname}
            desc={props.desc}
            photoURL={account?.photoURL}
            handleFollow={handleFollow}
            tick={account?.tick}
          />
          <Video
            vid={props.vid}
            hashtag={props.hashtag}
            url={props.url}
            likes={props.likes}
            comments={props.comments}
            shares={props.shares}
            handleLike={handleLike}
            liked={liked}
            goToDetailsVideo={goToDetailsVideo}
            handleShare={handleShare}
            views={props.views}
            name={account?.name}
            uid={props.uid}
          />
          <Divider sx={{ margin: '1rem' }} />
        </>
      )}
    </SCVideoItemWrapper>
  );
};

export default VideoItem;
