import React from 'react';
import Image from 'next/image';

import RefreshIcon from '@mui/icons-material/Refresh';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TelegramIcon from '@mui/icons-material/Telegram';
import styled from 'styled-components';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';

// @mui
import {
  Button,
  Box,
  Container,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Skeleton,
  CircularProgress,
  ClickAwayListener,
  Badge,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Add, MoreVert, MessageOutlined, InboxOutlined, SearchOutlined } from '@mui/icons-material';

// @mui icons

// Component
import UploadVideoDialog from '../dialogs/UploadVideoDialog';
import SettingsUserDialog from '../dialogs/SettingsUserDialog';
import SuggestedAccounts from './SuggestedAccounts';
import LoginDialog from '../dialogs/LoginDialog';
import SearchDataDisplay from '../data/SearchDataDisplay';
import AccountSettingMenu from '../menus/AccountSettingMenu';
import MoreVertMenu from '../menus/MoreVertMenu';
// firebase

import {
  collection,
  query,
  where,
  getDocs,
  startAt,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  limit,
  getCountFromServer,
} from 'firebase/firestore';
import { fStorage, fStore } from '../../firebase/init.firebase';
import { IAccountItem } from '../../interfaces/account.interface';
import UsersData from '../data/UsersData';
import { useRouter } from 'next/router';
import NotificationsMenu from '../menus/NotificationsMenu';
import { INotification } from '../../interfaces/notifications.interface';
import DatingDialog from '../dialogs/DatingDialog';
import { useSnackbar } from 'notistack';
import CartDialog from '../dialogs/CartDialog';
import { getCartCache } from '../../cache/cart.local.storage';
import { IProduct } from '../../interfaces/shop.interface';

// @ts-ignore
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce';

const SCHeader = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: space-around;
  -ms-flex-pack: space-around;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  box-shadow: 0px 1px 1px rgb(0 0 0 / 12%);
  height: 60px;
  width: 100%;
  top: 0;
  right: 0;
  position: fixed;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  z-index: 1000;
  flex-direction: column;
  flex-wrap: wrap;
`;

interface IHeaderWidthProps {
  detailsAccountPage: boolean;
}

const SCHeaderWrapper = styled(Container)<IHeaderWidthProps>`
  text-align: center;
  max-width: ${(props) => props.detailsAccountPage && '100vw !important'};
`;

const SCInputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  gap: 10px;
`;

const SCHeaderGrid = styled(Grid2)`
  align-items: center;
`;

const SCHeaderLogo = styled(Image)`
  text-align: start;
  cursor: pointer;
`;
const SCTextLogo = styled.div`
  font-family: Caveat;
  font-weight: 900;
  // color: rgb(255, 182, 0);
  color: black;
  text-shadow: rgba(115, 80, 255, 0.2) 0px 4.95424px 18.5784px;
  font-size: 1.5rem;
  margin-left: -0.8rem;
`;

const SCHeaderForm = styled(Box)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 12px 16px;
  background: rgba(22, 24, 35, 0.06);
  border-radius: 92px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin: 0 auto;
  gap: 10px;
`;
const SCHeaderInput = styled.input`
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  max-width: 292px;
  color: rgba(22, 24, 35, 1);
  caret-color: rgba(254, 44, 85, 1);
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  -ms-appearance: textfield;
  appearance: textfield;
  margin-right: auto;
`;

const SCHeaderNavigationWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const SCButton = styled(Button)`
  width: ${(props) => (props.startIcon ? '110px' : '100px')};
`;

const SCLoginButton = styled(SCButton)`
  background-color: rgba(254, 44, 85, 1) !important;
`;

const SCClickHiddent = styled.div``;

const SCMoreIconWrapper = styled.div``;

const SCRefreshIcon = styled(RefreshIcon)`
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  -webkit-animation: rotating 0.7s linear infinite;
  -moz-animation: rotating 0.7s linear infinite;
  -ms-animation: rotating 0.7s linear infinite;
  -o-animation: rotating 0.7s linear infinite;
  animation: rotating 0.7s linear infinite;
`;

const SCMicOffIcon = styled(MicOffIcon)`
  color: #ccc;
  font-size: 0.8rem;
  &:hover {
    cursor: pointer;
  }
`;

const SCMicIcon = styled(MicIcon)`
  font-size: 0.8rem;
  &:hover {
    cursor: pointer;
  }
`;

const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  const accounts = useAppSelector((state) => state.account.accounts);

  const { enqueueSnackbar } = useSnackbar();

  // Mic Plugins
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const cart = getCartCache();
  const cartRedux = useAppSelector((state) => state.shop.cart);

  const isFullScreenHeader = title.includes('@') || title.includes('Messages');

  const [detailsAccountPage, setDetailsAccountPage] = React.useState<boolean>(isFullScreenHeader);

  const profile = useAppSelector((state) => state.account.profile);
  const isLogin = useAppSelector((state) => state.auth.isLogin);

  const [notifications, setNotifications] = React.useState<Array<INotification>>([]);
  const [totalNotificationsNoRead, setTotalNotificationsNoRead] = React.useState<number>(0);
  const [limitNoti, setLimitNoti] = React.useState<number>(8);
  const [totalNoti, setTotalNoti] = React.useState<number>(0);

  // handle header menu
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
  const [anchorElNotiMenu, setAnchorElNotiMenu] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorElMenu);
  const openNoti = Boolean(anchorElNotiMenu);

  const [openUploadVideoDialog, setOpenUploadVideoDialog] = React.useState(false);

  const [queryUsers, setQueryUsers] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<Array<IAccountItem>>([]);
  const [openUsersData, setOpenUsersData] = React.useState<boolean>(false);

  const usersDataRef = React.useRef<any>(null);

  const debouncedValue = useDebounce(queryUsers, 800);

  const [openCartDialog, setOpenCartDialog] = React.useState<boolean>(false);

  const handleOpenCartDialog = () => {
    if (cart.length) {
      setOpenCartDialog(true);
    } else {
      enqueueSnackbar('You must add product to cart');
    }
  };

  const handleCloseCartDialog = () => {
    setOpenCartDialog(false);
  };

  // handle open menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleOpenNotiMenu = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      setLimitNoti(8);
      if (notifications.length < 1) {
        enqueueSnackbar("You don't have any notifications yet");
        return;
      }
      setAnchorElNotiMenu(event.currentTarget);
      notifications.forEach(async (notification: INotification) => {
        const notificationRef = doc(fStore, 'notifications', notification.nid);
        await updateDoc(notificationRef, {
          isRead: true,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseNotiMenu = () => {
    setAnchorElNotiMenu(null);
  };
  // handle login-dialog
  const [openLogInDialog, setOpenLogInDialog] = React.useState<boolean>(false);
  const [openSettingsUserDialog, setOpenSettingsUserDialog] = React.useState<boolean>(false);
  const [openDateDialog, setOpenSettingDateDialog] = React.useState<boolean>(false);

  const handleOpenLogInDialog = () => {
    setOpenLogInDialog(true);
  };

  const handleCloseSignInDialog = () => {
    setOpenLogInDialog(false);
  };

  // handle open date dialog
  const handleOpenDateDialog = () => {
    setOpenSettingDateDialog(true);
  };

  const handleCloseDateDialog = () => {
    setOpenSettingDateDialog(false);
  };

  // handle open settings user dialog

  const handleOpenSettingsUserDialog = () => {
    setOpenSettingsUserDialog(true);
  };

  const handleCloseSettingsUserDialog = () => {
    setOpenSettingsUserDialog(false);
  };

  const handleCloseUploadVideoDialog = () => {
    setOpenUploadVideoDialog(false);
  };

  const handleOpenUploadVideoDialog = () => {
    if (isLogin) {
      if (profile?.name && profile?.nickname) {
        setOpenUploadVideoDialog(true);
      } else {
        handleOpenSettingsUserDialog();
      }
    } else {
      handleOpenLogInDialog();
    }
  };

  const handleClickSearchButton = () => {
    if (!users.length) return;
    router.push(`/@${users[0].name}`);
  };

  const handleClickOutside = (event: any) => {
    if (!openUsersData) return;

    if (usersDataRef.current?.contains(event.target)) {
      return;
    } else {
      setOpenUsersData(false);
    }
  };
  React.useEffect(() => {
    // Click out side hidden UsersData
    document.addEventListener('click', handleClickOutside, true);
  }, [openUsersData]);

  React.useEffect(() => {
    if (!debouncedValue.trim()) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);
        if (!accounts) {
          return;
        }

        const q = query(collection(fStore, 'users'), orderBy('noAccentName'));
        const snapshot = await getDocs(q);
        const data: any = snapshot.docs.map((doc) => doc.data());

        if (Array.isArray(data)) {
          const result = data.filter((account: IAccountItem) =>
            account.noAccentName?.includes(debouncedValue.toLowerCase().trim()),
          );
          setUsers(result as Array<IAccountItem>);
          setLoading(false);
          setOpenUsersData(true);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.log(error);
        setUsers([]);
        setLoading(false);
        setOpenUsersData(false);
      }
    };

    searchUsers();
  }, [debouncedValue]);

  React.useEffect(() => {
    const getNotifications = async () => {
      try {
        if (!profile) return;

        const coll = query(collection(fStore, 'notifications'), where('receiverId', '==', profile.uid));
        const totalNoti = await getCountFromServer(coll);
        setTotalNoti(totalNoti.data().count);

        const q = query(
          collection(fStore, 'notifications'),
          where('receiverId', '==', profile.uid),
          orderBy('timestamp', 'desc'),
          limit(limitNoti),
        );

        if (q) {
          onSnapshot(q, (querySnapshot) => {
            const data: Array<INotification> = [];
            querySnapshot.forEach((doc) => {
              data.push(doc.data() as INotification);
            });

            const arr = data.filter((noti: INotification) => noti.senderId !== profile.uid);

            setNotifications(arr);

            const noReadData = arr.filter((noti: INotification) => noti.isRead === false);
            setTotalNotificationsNoRead(noReadData.length);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, [profile, limitNoti]);

  const goToHome = () => {
    router.push('/');
  };

  const goToMessagesPage = () => {
    router.push('/messages');
  };

  React.useEffect(() => {
    if (listening) {
      setQueryUsers(transcript);
    }
  }, [transcript]);

  return (
    <>
      <UploadVideoDialog open={openUploadVideoDialog} onClose={handleCloseUploadVideoDialog} />

      <SettingsUserDialog open={openSettingsUserDialog} onClose={handleCloseSettingsUserDialog} />
      <DatingDialog open={openDateDialog} handleClose={handleCloseDateDialog} />

      <CartDialog open={openCartDialog} handleClose={handleCloseCartDialog} />

      <SCHeader>
        <SCHeaderWrapper maxWidth="xl" disableGutters detailsAccountPage={detailsAccountPage}>
          <SCHeaderGrid container>
            <Grid2 md={2} display="flex" alignItems={'center'}>
              <SCHeaderLogo src="/logo.jpg" alt="Logo" width={70} height={40} onClick={goToHome} />
              <SCTextLogo>Kiwi</SCTextLogo>
            </Grid2>
            <Grid2 md={7}>
              <SCHeaderForm
                component="form"
                sx={{
                  width: 360,
                  height: 46,
                }}
              >
                <SCInputWrapper>
                  {listening ? (
                    <SCMicIcon onClick={SpeechRecognition.stopListening} />
                  ) : (
                    <SCMicOffIcon onClick={SpeechRecognition.startListening} />
                  )}
                  <SCHeaderInput
                    type="text"
                    value={queryUsers}
                    onChange={(event) => setQueryUsers(event?.target.value)}
                  />
                  {loading && <SCRefreshIcon sx={{ color: 'rgb(254,44,85)' }} />}
                  <Divider orientation="vertical" />
                  <SearchOutlined
                    sx={{ fontSize: 28, cursor: 'pointer' }}
                    color="action"
                    onClick={handleClickSearchButton}
                  />
                </SCInputWrapper>
              </SCHeaderForm>
            </Grid2>
            {/* UserData */}
            {openUsersData && (
              <SCClickHiddent ref={usersDataRef}>
                <UsersData users={users} />
              </SCClickHiddent>
            )}
            <Grid2 md={3}>
              <SCHeaderNavigationWrapper>
                <SCButton variant="outlined" startIcon={<Add />} size="medium" onClick={handleOpenUploadVideoDialog}>
                  Upload
                </SCButton>
                {isLogin ? (
                  <>
                    {/* Notifications Menu */}
                    <SCMoreIconWrapper>
                      <Tooltip title="Notifications">
                        <IconButton
                          onClick={handleOpenNotiMenu}
                          size="small"
                          aria-controls={openNoti ? 'notifications-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openNoti ? 'true' : undefined}
                        >
                          <Badge badgeContent={totalNotificationsNoRead} color="secondary">
                            <Image alt="notify" src={'/icons/notify.svg'} width={22} height={22} />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      <NotificationsMenu
                        notifications={notifications}
                        limitNoti={limitNoti}
                        setLimitNoti={setLimitNoti}
                        totalNoti={totalNoti}
                        anchorEl={anchorElNotiMenu}
                        id="notifications-menu"
                        open={openNoti}
                        onClose={handleCloseNotiMenu}
                        onClick={handleCloseNotiMenu}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 10,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      />
                    </SCMoreIconWrapper>

                    {/* Cart */}
                    <Tooltip title="Cart">
                      {cart.length || cartRedux.length ? (
                        <IconButton onClick={handleOpenCartDialog}>
                          <Badge badgeContent={cartRedux.length || cart.length} color="error">
                            <ShoppingCartIcon color="action" />
                          </Badge>
                        </IconButton>
                      ) : (
                        <IconButton onClick={handleOpenCartDialog}>
                          <ShoppingCartIcon color="action" />
                        </IconButton>
                      )}
                    </Tooltip>

                    {/* Chat */}
                    <Tooltip title="Messages">
                      <IconButton>
                        <TelegramIcon onClick={goToMessagesPage} />
                        {/* <Image
                          alt="chat"
                          src="/nav/message-regular.svg"
                          width={19}
                          height={19}
                          onClick={goToMessagesPage}
                          style={{ cursor: 'pointer' }}
                        /> */}
                      </IconButton>
                    </Tooltip>

                    {/* Date */}

                    <Tooltip title="Dating">
                      <IconButton>
                        <FavoriteIcon onClick={handleOpenDateDialog} />
                      </IconButton>
                    </Tooltip>

                    {/* Account menu */}
                    <SCMoreIconWrapper>
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleOpenMenu}
                          size="small"
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <Avatar
                            src={profile?.photoURL}
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundSize: 'cover',
                              WebkitBackgroundSize: 'cover',
                              objectFit: 'cover',
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <AccountSettingMenu
                        anchorEl={anchorElMenu}
                        id="account-menu"
                        open={open}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      />
                    </SCMoreIconWrapper>
                  </>
                ) : (
                  <>
                    <>
                      <SCLoginButton variant="contained" size="medium" onClick={handleOpenLogInDialog}>
                        Log in
                      </SCLoginButton>
                      <LoginDialog open={openLogInDialog} onClose={handleCloseSignInDialog} />
                    </>
                    <SCMoreIconWrapper>
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleOpenMenu}
                          size="small"
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                      <MoreVertMenu
                        anchorEl={anchorElMenu}
                        id="account-menu"
                        open={open}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      />
                    </SCMoreIconWrapper>
                  </>
                )}
              </SCHeaderNavigationWrapper>
            </Grid2>
          </SCHeaderGrid>
        </SCHeaderWrapper>
      </SCHeader>
    </>
  );
};

export default Header;
