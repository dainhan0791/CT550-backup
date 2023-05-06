import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { IVideoItem } from '../../interfaces/video.interface';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { displayK } from '../../utils/display';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
const SCWrap = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
`;

const SCVideo = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;
const SCPlayArrowRoundedICon = styled(PlayArrowRoundedIcon)`
  position: absolute;
  bottom: 0.1rem;
  color: white;
  font-size: 2.4rem !important;
`;
const SCView = styled.strong`
  color: white;
  font-weight: bold;
  position: absolute;
  bottom: 0.7rem;
  left: 2.4rem;
`;

const DetailsVideoPersonal = (video: IVideoItem) => {
  const router = useRouter();

  const { user } = router.query;

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const handlePlayVideo = async () => {
    if (!videoRef) return;

    if (!isPlaying) {
      const docRef = doc(fStore, 'videos', video.vid);
      if (docRef && video) {
        if (!video.views.includes(video.uid)) {
          const res = await updateDoc(docRef, {
            views: arrayUnion(video.uid),
          });
        }
        videoRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const goToDetailsVideo = () => {
    if (!video) return;
    if (!user) return;

    router.push(`/${user}/video/${video.vid}`);
  };

  return (
    <>
      <SCWrap>
        <SCVideo
          src={video.url}
          ref={videoRef}
          onMouseOver={handlePlayVideo}
          onMouseOut={handlePlayVideo}
          onClick={goToDetailsVideo}
        />
        <SCPlayArrowRoundedICon />
        <SCView>{displayK(video.views?.length)}</SCView>
      </SCWrap>
    </>
  );
};

export default DetailsVideoPersonal;
