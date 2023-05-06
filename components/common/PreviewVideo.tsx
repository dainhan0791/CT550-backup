import React from 'react';
import styled from 'styled-components';
import HashtagChip from '../chips/HashtagChip';

import useElementOnScreen from '../../hooks/useElementOnScreen';

const SCVideoWrapper = styled.div`
  margin: 0 0 1rem 1rem;
`;
const SCHashtagWrapper = styled.div``;
const SCVideoInnerWrapper = styled.div`
  width: 280px;
  height: 500px;
  max-height: 500px;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: start;
  cursor: pointer;
`;

const SCVideo = styled.video`
  height: 100% !important;
  max-width: 280px;
  display: block;
  object-fit: cover;
  border-radius: 0.4rem;
`;

interface IVideo {
  hashtag: string;
  url: string;
}

const PreviewVideo = (video: IVideo) => {
  const videoRef = React.useRef<any>();
  const [playing, setPlaying] = React.useState(false);
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
  };
  const isVisibile = useElementOnScreen(options, videoRef);

  React.useEffect(() => {
    if (!video) {
      return;
    }
    if (isVisibile) {
      if (!playing) {
        videoRef.current.play();
        setPlaying(true);
      }
    } else {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, [isVisibile]);

  const handleVideo = () => {
    if (!video) {
      return;
    }
    if (playing && videoRef) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <SCVideoWrapper>
      <SCHashtagWrapper>
        <HashtagChip hashtag={video.hashtag} isVideo />
      </SCHashtagWrapper>
      <SCVideoInnerWrapper onClick={handleVideo}>
        {video.url && <SCVideo ref={videoRef} src={video.url} loop preload="true" />}
      </SCVideoInnerWrapper>
    </SCVideoWrapper>
  );
};

export default PreviewVideo;
