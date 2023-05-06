import React from 'react';

import { Box, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { Home, People } from '@mui/icons-material';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks/hooks';
import LogInDialog from '../dialogs/LoginDialog';
import { useSnackbar } from 'notistack';

const SCListItemText = styled.p<any>`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${(props) => (props.home ? 'rgba(255,44,85,1)' : 'rgba(22, 24, 35, 1)')};
`;
const LeftSideBarMenu = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const profile = useAppSelector((state) => state.account.profile);

  const [openLoginDialog, setOpenLoginDialog] = React.useState<boolean>(false);

  const handleOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };
  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const goToHomePage = () => {
    router.push('/foryou');
  };
  const goToFollowingPage = () => {
    if (!profile?.following?.length) {
      enqueueSnackbar('You have not followed anyone yet');
      return;
    }
    if (isLogin) {
      router.push('/following');
    } else {
      handleOpenLoginDialog();
    }
  };
  return (
    <>
      <LogInDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
      <Box>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem disablePadding onClick={goToHomePage}>
              <ListItemButton>
                <ListItemIcon>
                  <Home sx={{ color: 'rgba(254, 44, 85, 1)', fontSize: '1.8rem' }} />
                </ListItemIcon>
                <SCListItemText home>For You</SCListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding onClick={goToFollowingPage}>
              <ListItemButton>
                <ListItemIcon>
                  <People sx={{ color: ' rgba(22, 24, 35, 1)', fontSize: '1.8rem' }} />
                </ListItemIcon>
                <SCListItemText>Following</SCListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </Box>
    </>
  );
};

export default LeftSideBarMenu;
