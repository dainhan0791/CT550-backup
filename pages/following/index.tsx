import React from 'react';

// Mui
import { Container } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import styled from 'styled-components';

// Components
import Layout from '../../components/shared/Layout';
import LeftSideBar from '../../components/shared/LeftNavBar';

// Typescript
import { IVideoItem } from '../../interfaces/video.interface';
import { useAppSelector } from '../../redux/hooks/hooks';
import Feeds from '../../components/shared/Feeds';

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
`;

export default function Following() {
  const profile = useAppSelector((state) => state.account.profile);
  let feeds = useAppSelector((state) => state.feeds.videos);

  // Feeds Following
  if (Array.isArray(feeds)) {
    feeds = feeds.filter((feed: IVideoItem) => profile?.following?.includes(feed.uid));
  }

  return (
    <Layout title="Following">
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
