import React from 'react';

// Mui
import { Container, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import styled from 'styled-components';

// Components
import Layout from '../../components/shared/Layout';
import LeftSideBar from '../../components/shared/LeftNavBar';
import Feeds from '../../components/shared/Feeds';

// Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { IVideoItem } from '../../interfaces/video.interface';
import { MediaDeviceMax } from '../../styles/device-size';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useRouter } from 'next/router';
import { setFeeds } from '../../redux/slices/feeds.slice';

const SCBodyWrapper = styled(Container)`
  margin-top: 70px;
`;

const SCGridLeftSideBar = styled(Grid2)`
  height: 100vh;
  overflow: hidden scroll;

  -ms-overflow-style: none; /* cho  Internet Explorer, Edge */
  scrollbar-width: none; /* cho Firefox */
  &::-webkit-scrollbar {
    display: none; /* cho Chrome, Safari, and Opera */
  }

  &:hover {
    -ms-overflow-style: block; /* cho  Internet Explorer, Edge */
    scrollbar-width: block; /* cho Firefox */
    &::-webkit-scrollbar {
      display: block; /* cho Chrome, Safari, and Opera */
    }
  }
  @media${MediaDeviceMax.tablet} {
    display: none;
  }
`;

export default function Discover() {
  const router = useRouter();

  const { discover } = router.query;

  let feeds = useAppSelector((state) => state.feeds.videos);

  if (!discover) return;

  feeds = feeds.filter((feed: IVideoItem) => feed.hashtag === discover.toString());

  return (
    <Layout title="Discover">
      <Container maxWidth="xl" disableGutters style={{ marginTop: '70px' }}>
        <Grid2 container spacing={3}>
          <SCGridLeftSideBar md={2.5}>
            <LeftSideBar />
          </SCGridLeftSideBar>
          <Grid2 md={9.5}>{Array.isArray(feeds) && <Feeds feeds={feeds} />}</Grid2>
        </Grid2>
      </Container>
    </Layout>
  );
}
