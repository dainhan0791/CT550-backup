import React from 'react';
import { ICart, IProduct } from '../../interfaces/shop.interface';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { displayPrice } from '../../utils/display';
import { addToCartCache, getCartCache } from '../../cache/cart.local.storage';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { setCartRedux } from '../../redux/slices/shop.slice';

const ProductItem = (props: IProduct) => {
  const { enqueueSnackbar } = useSnackbar();

  const profile = useAppSelector((state) => state.account.profile);

  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (props) {
      const cart = getCartCache();

      const index = cart.findIndex((item: ICart) => {
        return item.pid === props.pid;
      });

      const item = {
        ...props,
        quantity: 1,
      };

      if (index === -1) {
        addToCartCache([...cart, item]);
        dispatch(setCartRedux([...cart, item]));
      } else {
        enqueueSnackbar('You have added this product to your cart.');
      }
    }
  };

  // React.useEffect(() => {
  //   if (cart) {
  //     addToCartCache(cart);
  //     const data = getCartCache();
  //     console.log(data);
  //     setCart(data);
  //   }
  // }, [cart]);

  return (
    <div>
      {props && (
        <Card sx={{ width: '100%', padding: '0.5rem', height: '390px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              image={props.url}
              alt={props.url}
              style={{ objectFit: 'contain' }}
            />
            <CardContent sx={{ padding: '0.5rem', height: '130px', overflow: 'hidden' }}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                fontSize={'0.9rem'}
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                }}
              >
                {props.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={'0.8rem'}
                sx={{
                  wordWrap: 'break-word',
                  height: '68px',
                  overflowY: 'hidden',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                {props.desc}
              </Typography>

              <Typography variant="body2" color="red">
                {props.price && displayPrice(props.price)}
              </Typography>
            </CardContent>
          </CardActionArea>
          {profile?.uid !== props.uid ? (
            <CardActions sx={{ justifyContent: 'start' }}>
              <Button size="small" color="primary" variant="outlined" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </CardActions>
          ) : (
            <CardActions sx={{ justifyContent: 'start' }}>
              <Button size="small" color="primary" variant="outlined" onClick={handleAddToCart} disabled>
                Add to cart
              </Button>
            </CardActions>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProductItem;
