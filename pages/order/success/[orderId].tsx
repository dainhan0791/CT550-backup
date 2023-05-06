import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Alert, AlertTitle, Link } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Mui
import { Container, Skeleton, Typography, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

// Components
import Layout from '../../../components/shared/Layout';
import LeftSideBar from '../../../components/shared/LeftNavBar';

// Firebase
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { fStore } from '../../../firebase/init.firebase';
import { IVideoItem } from '../../../interfaces/video.interface';
import { MediaDeviceMax } from '../../../styles/device-size';
import { useAppSelector } from '../../../redux/hooks/hooks';
import { useRouter } from 'next/router';
import { IOrder } from '../../../interfaces/shop.interface';
import OrderDetails from '../../../components/items/OrderDetails';
import { displayTotalOrder } from '../../../utils/display';
import { StatusOrderEnum, StatusPaymentEnum } from '../../../enums/shop.enum';
import { guid } from '../../../utils/generates';

const SCWrap = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  background: #f5f5f5;
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
const SCBodyWrapper = styled.div`
  overflow: hidden scroll;
  height: 90vh;
  -ms-overflow-style: none; /* cho  Internet Explorer, Edge */
  scrollbar-width: none; /* cho Firefox */
  &::-webkit-scrollbar {
    display: none; /* cho Chrome, Safari, and Opera */
  }
`;

const SCTotalOrder = styled.div`
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const OrderSuccess = () => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);

  const { orderId } = router.query;

  React.useEffect(() => {
    const updateOrder = async () => {
      if (!orderId) return;
      if (!fStore) return;
      if (!profile) return;

      try {
        await updateDoc(doc(fStore, 'orders', orderId.toString()), {
          status: StatusOrderEnum.ORDER_SUCCESS,
          payment: StatusPaymentEnum.PAID,
        });

        const pid = guid();

        if (pid) {
          await setDoc(doc(fStore, 'payments', pid), {
            pid: pid,
            uid: profile?.uid,
            oid: orderId.toString(),
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.log(error);
        router.back();
      }
    };
    updateOrder();
  }, [orderId]);

  return (
    <Layout title="Order">
      <Container maxWidth="xl" disableGutters style={{ marginTop: '70px' }}>
        <Grid2 container spacing={3}>
          <SCGridLeftSideBar md={2.5}>
            <LeftSideBar />
          </SCGridLeftSideBar>
          <Grid2 md={9.5}>
            <SCBodyWrapper>
              <SCWrap>
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Payment success, click <Link href={'/order'}>ok</Link> to continue!
                </Alert>
                <Image src="/images/checkout.webp" width={400} alt="checkout" height={300} />
              </SCWrap>
            </SCBodyWrapper>
          </Grid2>
        </Grid2>
      </Container>
    </Layout>
  );
};

export default OrderSuccess;
