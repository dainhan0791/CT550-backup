import { Divider, Input } from '@mui/material';
import { arrayRemove, arrayUnion, doc, serverTimestamp, setDoc, updateDoc, increment } from 'firebase/firestore';
import { Router, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { fStore } from '../../firebase/init.firebase';
import { IAccountItem } from '../../interfaces/account.interface';
import { IComment } from '../../interfaces/comment.interface';
import { IVideoDetailsItem, IVideoItem } from '../../interfaces/video.interface';
import { useAppSelector } from '../../redux/hooks/hooks';
import { guid } from '../../utils/generates';
import AccountDetailsVideoItem from '../items/AccountDetailsVideoItem';
import ActionsVideo from './ActionsVideo';
import CoppyTag from './CoppyTag';
import DetailsVideoComments from './DetailsVideoComments';
import ShareDialog from '../dialogs/ShareDialog';
import Axios from 'axios';

const SCDetailsRightWrapper = styled.div`
  height: 100vh;
`;
const SCDetailsWrapper = styled.div`
  height: 40%:
  max-height: 40%;
  margin-top: 3rem;
  margin-left: 1rem;
  margin-right: 2rem;
`;

const DetailsRight = ({
  profileVideo,
  video,
  comments,
  limitComments,
  setLimitComments,
  totalComments,
}: {
  profileVideo: IAccountItem;
  video: IVideoDetailsItem;
  comments: Array<IComment>;
  totalComments: number;
  limitComments: number;
  setLimitComments: Function;
}) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);
  const { enqueueSnackbar } = useSnackbar();

  const liked = video.likes.includes(profile?.uid as string);
  const [openShareDialog, setOpenShareDialog] = React.useState<boolean>(false);

  const handleOpenShareDialog = () => {
    setOpenShareDialog(true);
  };
  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const coppyUrl = `${process.env.NEXT_PUBLIC_APPLICATION_URL}${router.asPath}`;

  const handleFollow = async () => {
    try {
      if (fStore && profile && profileVideo) {
        const userRef = doc(fStore, 'users', profileVideo.uid);
        const currentUserRef = doc(fStore, 'users', profile.uid);

        const nid = guid();
        const notificationsRef = doc(fStore, 'notifications', nid);

        if (profileVideo.uid !== profile.uid) {
          await updateDoc(userRef, {
            followers: arrayUnion(profile.uid),
          });
          await updateDoc(currentUserRef, {
            following: arrayUnion(profileVideo.uid),
          });

          await setDoc(notificationsRef, {
            nid: nid,
            senderId: profile.uid,
            receiverId: profileVideo.uid,
            type: 'follow',
            isRead: false,
            timestamp: serverTimestamp(),
          });

          await Axios.post(
            `${process.env.NEXT_PUBLIC_NEO4J_API}/user/friends/follow/${profile.uid}`,
            {
              id: profileVideo.uid,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          enqueueSnackbar(`Follow successfully`, { variant: 'success' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Follow failed', { variant: 'error' });
      console.log(error);
    }
  };
  const handleLike = async () => {
    try {
      if (fStore && profile && video) {
        const videoRef = doc(fStore, 'videos', video.vid);
        const userRef = doc(fStore, 'videos', video.uid);

        if (!liked) {
          await updateDoc(videoRef, {
            likes: arrayUnion(profile.uid),
          });
          await updateDoc(userRef, {
            likes: arrayUnion(profile.uid),
          });
          enqueueSnackbar(`Like successfully`, { variant: 'success' });
          return;
        } else {
          await updateDoc(videoRef, {
            likes: arrayRemove(profile.uid),
          });
          await updateDoc(userRef, {
            likes: arrayRemove(profile.uid),
          });
          enqueueSnackbar(`Dislike successfully`, { variant: 'success' });
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (text: string) => {
    try {
      if (fStore) {
        const cid = guid();
        const videoRef = doc(fStore, 'videos', video.vid);
        const commentRef = doc(fStore, 'comments', cid);
        if (commentRef && profile && video && text) {
          await setDoc(commentRef, {
            cid: cid,
            uid: profile.uid,
            vid: video.vid,
            text: text,
            creator: profile.uid === video.uid,
            timestamp: serverTimestamp(),
            likes: [],
            childrens: [],
          });
          await updateDoc(videoRef, {
            comments: increment(1),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SCDetailsRightWrapper>
      <ShareDialog open={openShareDialog} handleClose={handleCloseShareDialog} url={coppyUrl} />
      <SCDetailsWrapper>
        <AccountDetailsVideoItem
          uid={profileVideo.uid}
          name={profileVideo.name}
          nickname={profileVideo.nickname}
          photoURL={profileVideo.photoURL}
          desc={video?.desc}
          tick={profileVideo.tick}
          handleFollow={handleFollow}
          timestamp={video.timestamp}
        />

        <ActionsVideo
          views={video.views}
          likes={video.likes}
          comments={video.comments}
          shares={video.shares}
          handleLike={handleLike}
          liked={liked}
          handleOpenShareDialog={handleOpenShareDialog}
        />
        <CoppyTag tag={coppyUrl} />
      </SCDetailsWrapper>
      <Divider />
      {comments.length && limitComments && setLimitComments && totalComments ? (
        <DetailsVideoComments
          handleComment={handleComment}
          comments={comments}
          totalComments={totalComments}
          limitComments={limitComments}
          setLimitComments={setLimitComments}
        />
      ) : (
        <DetailsVideoComments
          handleComment={handleComment}
          comments={comments}
          totalComments={totalComments}
          limitComments={limitComments}
          setLimitComments={setLimitComments}
        />
      )}
    </SCDetailsRightWrapper>
  );
};

export default DetailsRight;
