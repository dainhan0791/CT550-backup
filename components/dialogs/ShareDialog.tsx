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

import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from 'react-share';

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from 'react-share';

import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount,
} from 'react-share';

import { Grid, MenuItem } from '@mui/material';

const SCWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

export default function ShareDialog({ open, handleClose, url }: { open: boolean; handleClose: Function; url: string }) {
  const onHandleClose = () => {
    handleClose && handleClose();
  };

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xs">
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleClose}></BootstrapDialogTitle>
        <DialogContent>
          <Grid container spacing="3">
            <Grid item md={12}>
              <MenuItem>
                <FacebookShareButton url={url}>
                  <SCWrap>
                    <FacebookIcon round={true} size={36} /> Share to Facebook
                  </SCWrap>
                </FacebookShareButton>
              </MenuItem>
              {/* <FacebookShareCount url={url}>{(shareCount: number) => shareCount}</FacebookShareCount> */}
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <TwitterShareButton url={url}>
                  <SCWrap>
                    <TwitterIcon round={true} size={36} /> Share to Twitter
                  </SCWrap>
                </TwitterShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <EmailShareButton url={url}>
                  <SCWrap>
                    <EmailIcon round={true} size={36} /> Share to Email
                  </SCWrap>
                </EmailShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <TelegramShareButton url={url}>
                  <SCWrap>
                    <TelegramIcon round={true} size={36} /> Share to Telegram
                  </SCWrap>
                </TelegramShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <WhatsappShareButton url={url}>
                  <SCWrap>
                    <WhatsappIcon round={true} size={36} /> Share to WhatsApp
                  </SCWrap>
                </WhatsappShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <LinkedinShareButton url={url}>
                  <SCWrap>
                    <LinkedinIcon round={true} size={36} /> Share to LinkedIn
                  </SCWrap>
                </LinkedinShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <LineShareButton url={url}>
                  <SCWrap>
                    <LineIcon round={true} size={36} /> Share to Line
                  </SCWrap>
                </LineShareButton>
              </MenuItem>
            </Grid>
            <Grid item md={12}>
              <MenuItem>
                <RedditShareButton url={url}>
                  <SCWrap>
                    <RedditIcon round={true} size={36} /> Share to Reddit
                  </SCWrap>
                </RedditShareButton>
              </MenuItem>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
