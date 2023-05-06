import React from 'react';

import styled from 'styled-components';
import HashtagChip from '../chips/HashtagChip';

import { Favorite, Textsms, Share } from '@mui/icons-material';
import useElementOnScreen from '../../hooks/useElementOnScreen';
import { IVideo } from '../../interfaces/video.interface';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { fStore } from '../../firebase/init.firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

const SCVideoWrapper = styled.div`
  margin-left: 5.7rem;
`;
const SCHashtagWrapper = styled.div`
  margin-left: -0.6rem;
`;
const SCVideoInnerWrapper = styled.div`
  width: 280px;
  height: 480px;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: start;
  cursor: pointer;
`;

const SCVideo = styled.video`
  height: 100% !important;
  max-width: 400px;

  display: block;
  object-fit: cover;
  border-radius: 0.4rem;
`;

const SCVideoActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1.2rem;
`;

const SCVideoActionInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  &:hover {
    opacity: 0.7;
  }
`;

const SCButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  background-color: rgba(22, 24, 35, 0.18);
  border-radius: 100%;
  width: 50px;
  height: 50px;
`;
const SCView = styled.p`
  color: rgba(22, 24, 35, 0.75);
  font-size: 12px;
  line-height: 17px;
  text-align: center;
`;

const Video = (props: IVideo) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);
  const videoRef = React.useRef<any>();
  const [playing, setPlaying] = React.useState(false);

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
  };
  const isVisibile = useElementOnScreen(options, videoRef);

  const autoPlayVideo = async () => {
    if (isVisibile) {
      if (!playing && props && fStore) {
        const docRef = doc(fStore, 'videos', props.vid);
        if (docRef && profile) {
          if (!props.views?.includes(profile.uid)) {
            await updateDoc(docRef, {
              views: arrayUnion(profile.uid),
            });
          }
          videoRef.current.play();
          setPlaying(true);
        }
      }
    } else {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  React.useEffect(() => {
    autoPlayVideo();
  }, [isVisibile]);

  const handleVideo = () => {
    if (props.goToDetailsVideo) {
      props.goToDetailsVideo();
    }
    // if (playing && videoRef) {
    //   videoRef.current.pause();
    //   setPlaying(false);
    // } else {
    //   videoRef.current.play();
    //   setPlaying(true);
    // }
  };

  const onHandleLike = () => {
    if (props.handleLike) {
      props.handleLike();
    }
  };

  const goToDetailsVideo = () => {
    if (props.goToDetailsVideo) {
      props.goToDetailsVideo();
    }
  };

  const onHandleShare = () => {
    if (props.handleShare) {
      props.handleShare();
    }
  };

  return (
    <SCVideoWrapper>
      <SCHashtagWrapper>{props.hashtag && <HashtagChip hashtag={props.hashtag} isVideo />}</SCHashtagWrapper>
      <SCVideoInnerWrapper>
        {props.url && <SCVideo onClick={handleVideo} ref={videoRef} src={props.url} loop preload="true" />}
        <SCVideoActionWrapper>
          {/* Likes */}
          <SCVideoActionInnerWrapper onClick={onHandleLike}>
            {props.liked ? (
              <SCButton style={{ color: '#fff', background: '#ff2c55' }}>
                <Favorite />
              </SCButton>
            ) : (
              <SCButton>
                <Favorite />
              </SCButton>
            )}

            <SCView>{props.likes.length}</SCView>
          </SCVideoActionInnerWrapper>
          {/* Comments */}
          <SCVideoActionInnerWrapper onClick={goToDetailsVideo}>
            <SCButton>
              <Textsms />
            </SCButton>
            <SCView>{props.comments}</SCView>
          </SCVideoActionInnerWrapper>

          <SCVideoActionInnerWrapper onClick={onHandleShare}>
            <SCButton>
              <Share />
            </SCButton>
            <SCView>{props.shares}</SCView>
          </SCVideoActionInnerWrapper>
        </SCVideoActionWrapper>
      </SCVideoInnerWrapper>
    </SCVideoWrapper>
  );
};

export default Video;
