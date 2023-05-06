import React from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { clearCartCache, getCartCache } from '../../cache/cart.local.storage';
import { Grid } from '@mui/material';
import { ICart } from '../../interfaces/shop.interface';
import ProductCartItem from '../items/ProductCartItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { calculateTotaPriceCart, displayPrice } from '../../utils/display';
import { guid } from '../../utils/generates';
import { fStore } from '../../firebase/init.firebase';
import { doc, setDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { getArrayProductIdInCart } from '../../utils/display';
import { StatusOrderEnum } from '../../enums/shop.enum';
import { StatusPaymentEnum } from '../../enums/shop.enum';
import { clearCartRedux } from '../../redux/slices/shop.slice';

const SCDialogContent = styled(DialogContent)`
  margin: 2rem;
`;
const SCHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const SCHeadContact = styled.p`
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 32px;
  color: #1a212b;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin-bottom: 1rem;
`;

const SCButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 2rem;
`;
const SCCancelButton = styled(Button)`
  width: 100px;
  height: 40px;

  background: #f5f7fc !important;
  color: #663323 !important;

  border: 1px solid #e7e9ef;
  border-radius: 8px;
`;
const SCSentButton = styled(Button)`
  width: 110px;
  height: 40px;

  background: #ffb600 !important;
  color: #663323 !important;
  font-weight: bold !important;

  border-radius: 8px;
`;

const SCTotalPriceWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0.5rem;
`;

const SCPrice = styled.div`
  color: rgb(255, 66, 78);
  font-size: 1rem;
  font-weight: bold;
`;

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CartDialog({ open, handleClose }: { open: boolean; handleClose: Function }) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.account.profile);

  const cart = getCartCache();

  const [total, setTotal] = React.useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();

  const onHandleClose = () => {
    handleClose && handleClose();
  };

  React.useEffect(() => {
    if (!cart.length) handleClose();

    setTotal(calculateTotaPriceCart(cart));
  }, [cart]);

  const handleOrderProducts = async () => {
    try {
      if (profile && fStore && total && cart) {
        const oid = guid();

        await setDoc(doc(fStore, 'orders', oid), {
          oid: oid,
          uid: profile.uid,
          products: cart,
          total: total,
          timestamp: serverTimestamp(),
          status: StatusOrderEnum.ORDER_PENDING,
          payment: StatusPaymentEnum.UNPAID,
        });

        await updateDoc(doc(fStore, 'users', profile.uid), {
          totalOrder: increment(1),
        });

        clearCartCache();
        dispatch(clearCartRedux());

        enqueueSnackbar('Order Success.', {
          variant: 'success',
        });

        router.push('/order');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xs">
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleClose}></BootstrapDialogTitle>
        <SCDialogContent>
          <SCHeadWrapper>
            <SCHeadContact>Your Cart</SCHeadContact>
          </SCHeadWrapper>

          <Grid container>
            {cart.length
              ? cart.map((item: ICart) => (
                  <Grid item md={12} key={item.pid}>
                    <ProductCartItem {...item} />
                  </Grid>
                ))
              : ''}
          </Grid>

          <SCTotalPriceWrap>
            <SCPrice>Total: {displayPrice(total)}</SCPrice>
          </SCTotalPriceWrap>

          <SCButtonWrapper>
            <SCCancelButton onClick={onHandleClose} variant="contained">
              Cancel
            </SCCancelButton>
            <SCSentButton variant="contained" onClick={handleOrderProducts}>
              Order
            </SCSentButton>
          </SCButtonWrapper>
        </SCDialogContent>
      </Dialog>
    </div>
  );
}
