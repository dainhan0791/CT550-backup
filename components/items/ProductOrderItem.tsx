import React from 'react';
import styled from 'styled-components';
import { Avatar, IconButton, Typography } from '@mui/material';

import { ICart, IProduct } from '../../interfaces/shop.interface';
import { displayPrice, displayQuantity } from '../../utils/display';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToCartCache, getCartCache } from '../../cache/cart.local.storage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { setCartRedux } from '../../redux/slices/shop.slice';

const SCHorizaltol = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
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

const SCAvatar = styled(Avatar)`
  > img {
    object-fit: contain;
  }
`;

const ProductOrderItem = (props: ICart) => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((state) => state.account.accounts);
  const account = accounts.find((account) => account.uid === props.uid);

  return (
    <SCHorizaltol style={{ marginTop: '0.8rem' }}>
      <Avatar src={account?.photoURL} />
      <SCAvatar src={props.url} variant="rounded" sx={{ width: '100px', height: '120px' }} />

      <SCVerticalBody>
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
    </SCHorizaltol>
  );
};

export default ProductOrderItem;
