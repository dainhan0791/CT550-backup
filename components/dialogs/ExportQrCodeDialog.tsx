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
import QRCode from 'qrcode.react';

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

const SCConfirmMessageWrapper = styled.div`
  width: 400px;
  min-height: 61px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 20px;
  text-align: center;
  color: #585e68;
  margin-bottom: 1.4rem;
`;
const SCConfirmMessageLabel = styled.p`
  font-weight: 500;
  margin-bottom: 0.8rem;
`;
const SCConfirmMessageText = styled.p`
  margin-top: 0.4rem;
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

export default function ExportQrCodeDialog({
  open,
  handleClose,
  handleDowloandQRCode,
  valueQRCode,
}: {
  open: boolean;
  handleClose: Function;
  handleDowloandQRCode: Function;
  valueQRCode: string;
}) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const onHandleClose = () => {
    handleClose && handleClose();
  };

  const onHandleDowloandQRCode = async () => {
    if (handleDowloandQRCode) {
      handleDowloandQRCode();
    }
  };

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xl">
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleClose}></BootstrapDialogTitle>
        <SCDialogContent>
          <SCHeadWrapper>
            <SCHeadContact>Export Account QR Code</SCHeadContact>
          </SCHeadWrapper>
          <SCConfirmMessageWrapper>
            <SCConfirmMessageLabel>
              <QRCode
                value={valueQRCode}
                renderAs="canvas"
                id={'qrCodeEl'}
                // imageSettings={{
                //     src: "/logo-yellowbg.svg",
                //     x: undefined,
                //     y: undefined,
                //     height: 24,
                //     width: 24,
                //     excavate: true,
                // }}
              />
            </SCConfirmMessageLabel>
            <SCConfirmMessageText>
              Downloand the QR code to share account information with many others
            </SCConfirmMessageText>
          </SCConfirmMessageWrapper>

          <SCButtonWrapper>
            <SCCancelButton onClick={onHandleClose} variant="contained">
              Cancel
            </SCCancelButton>
            <SCSentButton onClick={onHandleDowloandQRCode} variant="contained">
              Download
            </SCSentButton>
          </SCButtonWrapper>
        </SCDialogContent>
      </Dialog>
    </div>
  );
}
