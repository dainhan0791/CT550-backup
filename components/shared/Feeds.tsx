import React from 'react';
import styled from 'styled-components';
import VideoItem from '../items/VideoItem';

// firebase
import { Skeleton } from '@mui/material';
import { IVideoItem } from '../../interfaces/video.interface';

interface IFeedsProps {
  activeScroll: boolean;
}

const SCFeedstWrapper = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  // overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-bottom: 3rem;

  -ms-overflow-style: none; /* cho  Internet Explorer, Edge */
  scrollbar-width: none; /* cho Firefox */
  &::-webkit-scrollbar {
    display: none; /* cho Chrome, Safari, and Opera */
  }
`;

const Feeds = ({ feeds }: { feeds: Array<IVideoItem> }) => {
  const focusVideo = () => {
    if (Array.isArray(feeds)) {
      const element = document.getElementById('targetVideo');
      element && element.focus();
    }
  };
  React.useEffect(() => {
    focusVideo();
  }, []);

  return (
    <SCFeedstWrapper id="targetVideo">
      {!feeds.length && (
        <Skeleton variant="rounded">
          <VideoItem
            uid={''}
            vid={''}
            desc={''}
            hashtag={''}
            url={''}
            comments={0}
            shares={[]}
            likes={[]}
            views={[]}
            timestamp={undefined}
          />
        </Skeleton>
      )}
      {Array.isArray(feeds) && feeds.map((videoItem: any, index: number) => <VideoItem key={index} {...videoItem} />)}
    </SCFeedstWrapper>
  );
};

export default Feeds;
