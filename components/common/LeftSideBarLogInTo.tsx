import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../redux/hooks/hooks';
import LoginDialog from '../dialogs/LoginDialog';

const SCLeftSideBarLoginIntoWrapper = styled.div`
  width: 100%;
  margin-left: 1rem;
  margin-bottom: 1rem;
`;

const SCTextLoginTo = styled.p`
  display: block;
  color: rgba(22, 24, 35, 0.5);
  font-size: 1rem;
  line-height: 22px;
  margin: 1rem 0;
  width: 100% !important;
`;
const SCButton = styled(Button)`
  width: 240px !important;
  height: 44px;
  font-weight: bold;
`;

const LeftSideBarLogInTo = () => {
  const [openLogInDialog, setOpenLogInDialog] = React.useState(false);

  const handleClickOpenLogInDialog = () => {
    setOpenLogInDialog(true);
  };

  const handleCloseSignInDialog = () => {
    setOpenLogInDialog(false);
  };

  return (
    <>
      <SCLeftSideBarLoginIntoWrapper>
        <SCTextLoginTo>Log in to follow creators, like videos, and view comments.</SCTextLoginTo>
        <SCButton variant="outlined" size="medium" onClick={handleClickOpenLogInDialog} color="info">
          Log in
        </SCButton>
        <LoginDialog open={openLogInDialog} onClose={handleCloseSignInDialog} />
      </SCLeftSideBarLoginIntoWrapper>
    </>
  );
};

export default LeftSideBarLogInTo;
