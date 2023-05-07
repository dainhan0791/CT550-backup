import React from 'react';

// Mui
import { Container, Grid, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Grid2 from '@mui/material/Unstable_Grid2';

import styled from 'styled-components';

// Components
import Layout from '../../components/shared/Layout';
import LeftSideBar from '../../components/shared/LeftNavBar';

// Firebase
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { IVideoItem } from '../../interfaces/video.interface';
import { MediaDeviceMax } from '../../styles/device-size';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useRouter } from 'next/router';
import { getNameInRouter } from '../../utils/helper';
import AccountPersonalItem from '../../components/items/AccountPersonalItem';
import DetailsVideoPersonal from '../../components/common/DetailsVideoPersonal';
import { IProduct } from '../../interfaces/shop.interface';
import ProductItem from '../../components/items/ProductItem';

const SCBodyWrapper = styled(Container)`
  margin-top: 70px;
  max-width: 100vw !important;
  padding-bottom: 2rem;
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

const SCVideoPersonalWrap = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;

  margin-bottom: 2.5rem;
`;

export default function DetailsAccount() {
  const router = useRouter();

  const { user } = router.query;

  const [tag, setTag] = React.useState<string>('1');

  const [products, setProducts] = React.useState<Array<IProduct>>([]);

  let feeds = useAppSelector((state) => state.feeds.videos);

  const accounts = useAppSelector((state) => state.account.accounts);

  if (!user) return;

  const account = accounts.find((account) => account.name === getNameInRouter(user.toString()));

  // Feeds Personal
  if (Array.isArray(feeds) && account) {
    feeds = feeds.filter((feed: IVideoItem) => feed.uid === account.uid);
  }

  const handleChangeTag = (Event: React.SyntheticEvent, newValue: string) => {
    if (newValue) {
      setTag(newValue);
    }
  };


  const fetchProducts = async () => {
    try {
      if (!products.length) {
        if (account && fStore) {
          const q = query(collection(fStore, 'products'), where('uid', '==', account.uid));
          const data: Array<IProduct> = [];
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            data.push(doc.data() as IProduct);
          });
          setProducts(data.sort((a: IProduct, b: IProduct) => a.price - b.price));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();

  return (
    <Layout title={`${account?.nickname}(@${account?.name})`}>
      <SCBodyWrapper disableGutters>
        <Grid2 container spacing={3}>
          <SCGridLeftSideBar md={2.5}>
            <LeftSideBar />
          </SCGridLeftSideBar>
          <Grid2 md={9.5} sx={{ overflow: 'scroll', height: '100vh' }}>
            {account && <AccountPersonalItem {...account} />}

            {account?.tick ? (
              <TabContext value={tag}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(event, newValue) => handleChangeTag(event, newValue)}
                    aria-label="lab API tabs example"
                  >
                    <Tab label={`Video (${feeds.length})`} value="1" />
                    <Tab label={`Products (${account.totalProducts})`} value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: '1rem 0' }}>
                  <SCVideoPersonalWrap>
                    <Grid container spacing={2}>
                      {feeds.length
                        ? feeds.map((feed: IVideoItem) => (
                            <>
                              <Grid item md={2.4} key={feed.vid}>
                                <DetailsVideoPersonal {...feed} />
                              </Grid>
                            </>
                          ))
                        : ''}
                    </Grid>
                  </SCVideoPersonalWrap>
                </TabPanel>
                <TabPanel value="2" style={{ padding: '1rem 0' }}>
                  <SCVideoPersonalWrap>
                    <Grid container spacing={2}>
                      {products.length
                        ? products.map((product: IProduct) => (
                            <>
                              <Grid item md={2.4} key={product.pid}>
                                <ProductItem {...product} />
                              </Grid>
                            </>
                          ))
                        : ''}
                    </Grid>
                  </SCVideoPersonalWrap>
                </TabPanel>
              </TabContext>
            ) : (
              <div>
                <SCVideoPersonalWrap>
                  <Grid container spacing={2}>
                    {feeds.length
                      ? feeds.map((feed: IVideoItem) => (
                          <>
                            <Grid item md={2.4} key={feed.vid}>
                              <DetailsVideoPersonal {...feed} />
                            </Grid>
                          </>
                        ))
                      : ''}
                  </Grid>
                </SCVideoPersonalWrap>
              </div>
            )}
          </Grid2>
        </Grid2>
      </SCBodyWrapper>
    </Layout>
  );
}
