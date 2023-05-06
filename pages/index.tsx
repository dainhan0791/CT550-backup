import React from 'react';

// Mui
import { Container, Skeleton } from '@mui/material';

// Components
import Layout from '../components/shared/Layout';
import { useRouter } from 'next/router';
import { useAppSelector } from '../redux/hooks/hooks';

export default function Home() {
  const router = useRouter();
  const feeds = useAppSelector((state) => state.feeds.videos);

  React.useEffect(() => {
    if (feeds) {
      router.push('/foryou');
    }
  }, []);

  return (
    <Layout title="For You">
      <Skeleton sx={{ width: '100vw', height: '100vh', transform: 'none' }} />
    </Layout>
  );
}
