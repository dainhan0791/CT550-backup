import React from 'react';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import SettingsUserDialog from '../dialogs/SettingsUserDialog';
import { handleSignOutFirebase } from '../../firebase/utils.firebase';
import { Logout, Settings, Person, QrCode } from '@mui/icons-material';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { LOGOUT_SUCCESS, LOGOUT_ERROR } from '../../constants/login.constant';
import { setIsLogin } from '../../redux/slices/auth.slice';
import { clearProfile } from '../../redux/slices/account.slice';
import { useRouter } from 'next/router';
import ExportQrCodeDialog from '../dialogs/ExportQrCodeDialog';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ScannerQrCodeDialog from '../dialogs/ScannerQrCodeDialog';
import { Check } from '@mui/icons-material';
import SuccessSendMailDialog from '../dialogs/SuccessSendMailDialog';
import InventoryIcon from '@mui/icons-material/Inventory';
import { fStorage, fStore } from '../../firebase/init.firebase';
import { ref } from 'firebase/storage';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import CreateProductsDialog from '../dialogs/CreateProductsDialog';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  border-radius: 50%;
  color: white;
  width: 1.5rem !important;
  height: 1.5rem !important;
`;
const AccountSettingMenu = ({
  anchorEl,
  id,
  open,
  onClose,
  onClick,
  PaperProps,
  transformOrigin,
  anchorOrigin,
}: {
  anchorEl: any;
  id: string;
  open: any;
  onClose: any;
  onClick: any;
  PaperProps: object;
  transformOrigin: any;
  anchorOrigin: any;
}) => {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_APPLICATION_URL;

  const profile = useAppSelector((state) => state.account.profile);

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [openSettingsUserDialog, setOpenSettingsUserDialog] = React.useState<boolean>(false);
  const handleOpenSettingsUserDialog = () => {
    setOpenSettingsUserDialog(true);
  };
  const handleCloseSettingsUserDialog = () => {
    setOpenSettingsUserDialog(false);
  };

  const [openExportQrCodeDialog, setOpenExportQrCodeDialog] = React.useState<boolean>(false);
  const handleOpenExportQrCodeDialog = () => {
    setOpenExportQrCodeDialog(true);
  };
  const handleCloseExportQrCodeDialog = () => {
    setOpenExportQrCodeDialog(false);
  };

  const [openScannerQrCodeDialog, setOpenScannerQrCodeDialog] = React.useState<boolean>(false);
  const handleOpenScannerQrCodeDialog = () => {
    setOpenScannerQrCodeDialog(true);
  };
  const handleCloseScannerQrCodeDialog = () => {
    setOpenScannerQrCodeDialog(false);
  };

  const [openSuccessSendMailDialog, setOpenSuccessSendMailDialog] = React.useState<boolean>(false);
  const handleOpenSuccessSendMailDialog = () => {
    setOpenSuccessSendMailDialog(true);
  };
  const handleCloseSuccessSendMailDialog = () => {
    setOpenSuccessSendMailDialog(false);
  };

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = React.useState<boolean>(false);
  const handleOpenCreateProductsDialog = () => {
    setOpenCreateProductsDialog(true);
  };
  const handleCloseCreateProductsDialog = () => {
    setOpenCreateProductsDialog(false);
  };

  const goToProfilePage = () => {
    if (!profile) return;
    router.push(`/@${profile.name}`);
  };

  const valueQRCode = `${domain}/@${profile?.name}`;

  const handleDowloandQRCode = () => {
    if (!valueQRCode) return;

    let canvas = document.getElementById('qrCodeEl') as HTMLCanvasElement;
    const a = document.createElement('a');

    if (a && canvas && profile) {
      const href = canvas.toDataURL();

      a.download = profile.name;
      a.href = href;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);
    }
  };

  const handleScannerQRCode = () => {
    handleOpenScannerQrCodeDialog();
  };

  const handleLogout = async () => {
    try {
      await handleSignOutFirebase();
      enqueueSnackbar(LOGOUT_SUCCESS, { variant: 'success' });
      dispatch(clearProfile());
      dispatch(setIsLogin(false));
    } catch (error) {
      console.log(error);
      enqueueSnackbar(LOGOUT_ERROR, { variant: 'error' });
      dispatch(setIsLogin(true));
    }
  };

  const handleReceiverTick = async () => {
    if (!profile) return;

    if (profile.tick) {
      enqueueSnackbar('You got tick', {
        variant: 'info',
      });
      return;
    }

    try {
      const data = {
        email: profile.email,
        name: profile.name,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      if (jsonData) {
        enqueueSnackbar('Email Sent', {
          variant: 'success',
        });

        await setDoc(doc(fStore, 'contacts', profile.uid), {
          cid: profile.uid,
          uid: profile.uid,
          content: 'request-tick',
          status: 'pending',
          timestamp: serverTimestamp(),
        });

        await updateDoc(doc(fStore, 'users', profile.uid), {
          tick: true,
        });

        handleOpenSuccessSendMailDialog();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Email Not Sent, your email is not valid', {
        variant: 'error',
      });
    }
    // create reusable transporter object using the default SMTP transport
  };

  const handleCreateProducts = () => {
    handleOpenCreateProductsDialog();
  };

  const goToOrderPage = () => {
    router.push('/order');
  };

  return (
    <>
      <SettingsUserDialog open={openSettingsUserDialog} onClose={handleCloseSettingsUserDialog} />

      <ExportQrCodeDialog
        open={openExportQrCodeDialog}
        handleClose={handleCloseExportQrCodeDialog}
        handleDowloandQRCode={handleDowloandQRCode}
        valueQRCode={valueQRCode}
      />

      <ScannerQrCodeDialog open={openScannerQrCodeDialog} handleClose={handleCloseScannerQrCodeDialog} />

      <SuccessSendMailDialog open={openSuccessSendMailDialog} handleClose={handleCloseSuccessSendMailDialog} />

      <CreateProductsDialog open={openCreateProductsDialog} handleClose={handleCloseCreateProductsDialog} />

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
        <SCMenuItem onClick={handleOpenSettingsUserDialog}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          Settings
        </SCMenuItem>

        <SCMenuItem onClick={goToProfilePage}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          Profile
        </SCMenuItem>
        <SCMenuItem onClick={handleOpenExportQrCodeDialog}>
          <ListItemIcon>
            <QrCode />
          </ListItemIcon>
          Export Qr Code
        </SCMenuItem>

        <SCMenuItem onClick={handleScannerQRCode}>
          <ListItemIcon>
            <QrCodeScannerIcon />
          </ListItemIcon>
          Scanner Qr Code
        </SCMenuItem>

        {profile?.tick && (
          <SCMenuItem onClick={handleCreateProducts}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            Create Products
          </SCMenuItem>
        )}

        <SCMenuItem onClick={goToOrderPage}>
          <ListItemIcon>
            <LocalMallIcon />
          </ListItemIcon>
          Orders
        </SCMenuItem>

        <SCMenuItem onClick={handleReceiverTick}>
          <ListItemIcon>
            <SCCheckIcon />
          </ListItemIcon>
          Receiver Tick
        </SCMenuItem>

        <Divider />
        <SCMenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </SCMenuItem>
      </Menu>
    </>
  );
};

const SCMenuItem = styled(MenuItem)`
  min-width: 9rem;
  display: flex;
  justify-content: start;
`;

export default AccountSettingMenu;
