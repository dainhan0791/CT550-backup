import React from 'react';
import styled from 'styled-components';
import { Avatar, Divider, IconButton, Typography, Grid, Button } from '@mui/material';

import { ICart, IOrder, IProduct } from '../../interfaces/shop.interface';
import { displayPrice, displayQuantity } from '../../utils/display';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToCartCache, getCartCache } from '../../cache/cart.local.storage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { setCartRedux } from '../../redux/slices/shop.slice';
import ProductOrderItem from './ProductOrderItem';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSnackbar } from 'notistack';
import { StatusOrderEnum, StatusPaymentEnum } from '../../enums/shop.enum';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_test_51McT2cEEXsAWh5k8wVM6KFpB4Rayf9zxkcpVssRjogvXdBTZeU3J8fDDFmpWQVT15m0l8mdQPWjWFIHxhGxzhsoa00C22xGaGA',
    );
  }

  return stripePromise;
};

const SCOrderDetailsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 2rem;
`;
const SCVerticalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SCVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`;

const SCHeadWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 2rem;
`;

const SCPrice = styled.div`
  color: rgb(255, 66, 78);
  font-size: 1rem;
  font-weight: bold;
`;

const SCStatusItem = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #4da6ff;
  color: #fff;
  width: fit-content;
`;

const SCStatusVertifyItem = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: SeaGreen;
  color: #fff;
  width: fit-content;
`;

const SCInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  justify-content: center;
  gap: 0.5rem;
`;

const SCButton = styled(Button)`
  color: white !important;
  background: rgba(254, 44, 85, 1) !important;
  width: 110px;
  border-color: transparent !important;
`;

const SCTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
`;

const OrderDetails = (props: IOrder) => {
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const accounts = useAppSelector((state) => state.account.accounts);

  const account = accounts.find((account) => account.uid === props.uid);

  const [stripeError, setStripeError] = React.useState<any>(null);

  const item = {
    price: 'price_1MzG0mEEXsAWh5k8x5sBmV4i',
    quantity: 1,
  };

  const checkoutOptions: any = {};

  const redirectToCheckout = async (id: string) => {
    const stripe = await getStripe();

    if (stripe) {
      if (id === 'prod_NklXi9bdoHJUJd') {
        const { error } = await stripe.redirectToCheckout({
          lineItems: [item],
          mode: 'payment',
          successUrl: `${window.location.origin}/order/success/${props.oid}`,
          cancelUrl: `${window.location.origin}/order`,
        });

        if (error) {
          setStripeError(error.message);
        }
      }
    }
  };

  React.useEffect(() => {
    if (stripeError) {
      enqueueSnackbar(stripeError, {
        variant: 'error',
      });
    }
  }, []);

  const handlePayment = () => {
    redirectToCheckout('prod_NklXi9bdoHJUJd');
  };

  return (
    <>
      <Divider />
      <SCOrderDetailsWrap style={{ marginTop: '0.8rem' }}>
        <SCHeadWrap>
          <SCPrice>Total: {displayPrice(props.total)}</SCPrice>
          <SCTime>
            <AccessTimeIcon />
            <p>{moment(props.timestamp.seconds * 1000).fromNow()}</p>
          </SCTime>
        </SCHeadWrap>

        <Grid container>
          <Grid item md={5}>
            {props.products?.length &&
              props.products.map((item: ICart) => <ProductOrderItem {...item} key={item.pid} />)}
          </Grid>
          <Grid item md={5}>
            {account && (
              <SCInfoWrap>
                {props.status === StatusOrderEnum.ORDER_SUCCESS && props.payment === StatusPaymentEnum.PAID ? (
                  <>
                    <SCStatusVertifyItem>Status: {props.status}</SCStatusVertifyItem>
                    <SCStatusVertifyItem>Payment : {props.payment}</SCStatusVertifyItem>
                  </>
                ) : (
                  <>
                    <SCStatusItem>Status: {props.status}</SCStatusItem>
                    <SCStatusItem>Payment : {props.payment}</SCStatusItem>
                  </>
                )}
              </SCInfoWrap>
            )}
          </Grid>
          <Grid item md={2}>
            {account && (
              <SCInfoWrap>
                {props.payment === StatusPaymentEnum.PAID ? (
                  <SCButton variant="outlined" color="inherit" disabled>
                    Bought
                  </SCButton>
                ) : (
                  <SCButton variant="outlined" onClick={handlePayment}>
                    Pay
                  </SCButton>
                )}
              </SCInfoWrap>
            )}
          </Grid>
        </Grid>

        {/* <SCVerticalBody>
        <Typography
          gutterBottom
          variant="body1"
          color={'black'}
          component="div"
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {props.name}
        </Typography>

        <Typography variant="body2" color="red">
          {props.price && displayPrice(props.price)}
        </Typography>

        <Typography variant="body2" color="blue">
          {displayQuantity(props.quantity)}
        </Typography>
      </SCVerticalBody>

      <SCVertical>
        <SCHorizaltol>
          <IconButton>
            <RemoveIcon />
          </IconButton>

          <IconButton>
            <AddIcon />
          </IconButton>
        </SCHorizaltol>
      </SCVertical> */}
      </SCOrderDetailsWrap>
      <Divider />
    </>
  );
};

export default OrderDetails;
