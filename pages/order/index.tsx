import React from 'react';

// Mui
import { Container, Skeleton, Typography } from '@mui/material';
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
import { IOrder } from '../../interfaces/shop.interface';
import OrderDetails from '../../components/items/OrderDetails';
import { displayTotalOrder } from '../../utils/display';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';

const SCBodyWrapper = styled.div`
  overflow: hidden scroll;
  height: 90vh;
  -ms-overflow-style: none; /* cho  Internet Explorer, Edge */
  scrollbar-width: none; /* cho Firefox */
  &::-webkit-scrollbar {
    display: none; /* cho Chrome, Safari, and Opera */
  }
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

const SCTotalOrder = styled.div`
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SCInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 0.5rem;
  width: 100%:
  justify-content: end;
`;

const SCItem = styled.div`
  padding: 0.3rem 0rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: fit-content;
  font-size: 0.9rem;
  gap: 0.3rem;
`;

export default function Order() {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);
  const [order, setOrder] = React.useState<Array<IOrder>>([]);

  React.useEffect(() => {
    const getOrders = async () => {
      if (!profile) return;

      try {
        const q = query(collection(fStore, 'orders'), where('uid', '==', profile.uid));

        const data: Array<IOrder> = [];

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          data.push(doc.data() as IOrder);
        });

        setOrder(data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
  }, [profile?.totalOrder]);

  return (
    <Layout title="Order">
      <Container maxWidth="xl" disableGutters style={{ marginTop: '70px' }}>
        <Grid2 container spacing={3}>
          <SCGridLeftSideBar md={2.5}>
            <LeftSideBar />
          </SCGridLeftSideBar>
          <Grid2 md={9.5}>
            <SCBodyWrapper>
              <SCTotalOrder>{displayTotalOrder(profile?.totalOrder || 0)}</SCTotalOrder>
              {profile && (
                <SCInfoWrap>
                  <SCItem>
                    <PhoneIcon />
                    {profile.phoneNumber}
                  </SCItem>
                  <SCItem>
                    <PersonIcon /> {profile.name}
                  </SCItem>
                  <SCItem>
                    <MailIcon /> {profile.email}
                  </SCItem>
                </SCInfoWrap>
              )}

              {order.length ? order.map((item: IOrder) => <OrderDetails {...item} key={item.oid} />) : ''}
            </SCBodyWrapper>
          </Grid2>
        </Grid2>
      </Container>
    </Layout>
  );
}
