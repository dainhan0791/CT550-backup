import React from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import QrScanner from 'qr-scanner';

const SCDialogContent = styled(DialogContent)`
  margin: 2rem;
  display: flex !important;
  align-items: center !important;
  flex-direction: column !important;
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

export default function ScannerQrCodeDialog({ open, handleClose }: { open: boolean; handleClose: Function }) {
  const router = useRouter();

  const [file, setFile] = React.useState<any>();
  const [result, setResult] = React.useState<any>();

  const { enqueueSnackbar } = useSnackbar();

  const onHandleClose = () => {
    handleClose && handleClose();
  };

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setFile(file);
      setResult(null);
    }
  };

  const handleScanner = async () => {
    if (file) {
      try {
        const result = await QrScanner.scanImage(file);
        if (result) {
          enqueueSnackbar(<a href={result}>{result}</a>);
          setResult(result);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('No Result, please select an other Qr code', {
          variant: 'error',
        });
      }
    }
  };

  React.useEffect(() => {
    if (result) {
      window.open(result);
    }
  }, [result]);

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xl">
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleClose}></BootstrapDialogTitle>
        <SCDialogContent>
          <SCHeadWrapper>
            <SCHeadContact>Scanner QR Code</SCHeadContact>
          </SCHeadWrapper>
          <SCConfirmMessageWrapper>
            <SCConfirmMessageLabel>
              <input type="file" accept="image/*" onChange={(event) => onFileChange(event)} />
            </SCConfirmMessageLabel>
            <SCConfirmMessageText>
              {file?.preview && <Image src={file.preview} alt={file.preview} width={128} height={128} />}
            </SCConfirmMessageText>
          </SCConfirmMessageWrapper>

          {result && <Link href={result}>{result}</Link>}

          <SCButtonWrapper>
            <SCCancelButton onClick={onHandleClose} variant="contained">
              Cancel
            </SCCancelButton>
            <SCSentButton variant="contained" onClick={handleScanner}>
              Scanner
            </SCSentButton>
          </SCButtonWrapper>
        </SCDialogContent>
      </Dialog>
    </div>
  );
}
