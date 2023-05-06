import React from 'react';
import styled from 'styled-components';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Send, IosShare } from '@mui/icons-material';
import { useAppSelector } from '../../redux/hooks/hooks';

const PersonalAccountMenu = ({
  isPersonal,
  anchorEl,
  id,
  open,
  onClose,
  onClick,
  PaperProps,
  transformOrigin,
  anchorOrigin,
  handleSendMessage,
  handleShareAccount,
}: {
  isPersonal: boolean;
  anchorEl: any;
  id: string;
  open: any;
  onClose: any;
  onClick: any;
  PaperProps: object;
  transformOrigin: any;
  anchorOrigin: any;
  handleSendMessage: Function;
  handleShareAccount: Function;
}) => {
  const onHandleSendMessage = () => {
    if (handleSendMessage) {
      handleSendMessage();
    }
  };

  const onHandleShareAccount = () => {
    if (handleShareAccount) {
      handleShareAccount();
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={onClose}
      onClick={onClose}
      PaperProps={PaperProps}
      transformOrigin={transformOrigin}
      anchorOrigin={anchorOrigin}
    >
      {!isPersonal && (
        <MenuItem onClick={onHandleSendMessage}>
          <ListItemIcon>
            <Send fontSize="small" />
          </ListItemIcon>
          <h5>Send message</h5>
        </MenuItem>
      )}
      <MenuItem onClick={onHandleShareAccount}>
        <ListItemIcon>
          <IosShare fontSize="small" />
        </ListItemIcon>
        <h5>Share</h5>
      </MenuItem>
    </Menu>
  );
};

export default PersonalAccountMenu;
