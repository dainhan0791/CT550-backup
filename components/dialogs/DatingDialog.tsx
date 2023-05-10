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
  Autocomplete,
  Box,
  Grid,
  MenuItem,
  TextField,
  Checkbox,
  FormControl,
  Select,
  InputLabel,
  ImageList,
  ImageListItem,
  Avatar,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { useFormik } from 'formik';
import { IAccountItem, ICountryType } from '../../interfaces/account.interface';
import { CountriesConstant } from '../../constants/country.constant';
import { DatingValidationSchema } from '../../validation/dating.validation';
import AlertError from '../common/AlertError';
import { useAppSelector } from '../../redux/hooks/hooks';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { fStorage, fStore } from '../../firebase/init.firebase';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ILabelValue } from '../../interfaces/config.interface';
import AccountDatingItem from '../items/AccountDatingItem';
import { uploadBytes, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Axios from 'axios';

const SCWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SCDialogTitle = styled(DialogTitle)`
  font-size: 1.2rem;
  text-transform: uppercase;
  font-family: 'Gambetta', serif;
  transition: 700ms ease;
  font-variation-settings: 'wght' 311;
  margin-bottom: 0.8rem;
  color: black;
  outline: none;
  text-align: center;
  margin-bottom: 0;
`;

const SCForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
`;

const SCTextField = styled(TextField)`
  width: 420px !important;
  margin-bottom: 1rem !important;
`;

const SCButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: flex-end;
  margin-top: 0.5rem !important;
`;

const SCSelect = styled(Select)`
  width: 420px !important;

  margin-bottom: 1rem;
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const sexOption = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Lgbt',
    value: 'lgbt',
  },
];

export default function DatingDialog({ open, handleClose }: { open: boolean; handleClose: Function }) {
  const { enqueueSnackbar } = useSnackbar();

  const profile = useAppSelector((state) => state.account.profile);

  const favoriteItems = useAppSelector((state) => state.configApp.config?.favoriteItems);
  const targetItems = useAppSelector((state) => state.configApp.config?.targetItems);

  const accounts = useAppSelector((state) => state.account.accounts);

  const [images, setImages] = React.useState<any>([]);

  const [url, setUrl] = React.useState<string>('');
  const [urls, setUrls] = React.useState<Array<string>>([]);

  const [list, setList] = React.useState<Array<IAccountItem>>([]);
  const [listInvite, setListInvite] = React.useState<Array<IAccountItem>>([]);
  const [listInvited, setListInvited] = React.useState<Array<IAccountItem>>([]);
  const [listMatch, setListMatch] = React.useState<Array<IAccountItem>>([]);

  const [isDisplaySettings, setIsDisplaySettings] = React.useState<boolean>(false);

  const [tag, setTag] = React.useState('1');

  const handleChangeTag = (event: React.SyntheticEvent, newValue: string) => {
    setTag(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!profile) return;
        const res = await Axios.get(`${process.env.NEXT_PUBLIC_NEO4J_API}/user/${profile.uid}`);

        if (res.data?.length) {
          const unique = res.data.filter((c: IAccountItem, index: number) => {
            return res.data.indexOf(c) === index;
          });

          const result: Array<IAccountItem> = accounts.filter((item: IAccountItem) => unique.includes(item.uid));

          let list: Array<IAccountItem> = [];
          let listInvite: Array<IAccountItem> = [];
          let listInvited: Array<IAccountItem> = [];
          let listMatch: Array<IAccountItem> = [];

          // const userTarget = doc(fStore, 'users', account.uid);

          if (result?.length && profile) {
            result.forEach((item: IAccountItem) => {
              // Validate
              if (
                item?.country === profile?.country &&
                item.uid !== profile.uid &&
                !profile.inviteDating?.includes(item.uid) &&
                profile.targets?.includes(item?.sex || '') &&
                profile.favorites?.filter((favorite: string) => item.favorites?.includes(favorite)).length
              ) {
                list.push(item);
              }

              // Invite
              if (profile.inviteDating?.includes(item.uid)) {
                listInvite.push(item);
              }

              // Invited
              if (profile.invitedDating?.includes(item.uid)) {
                listInvited.push(item);
              }

              // Math
              if (profile.inviteDating?.includes(item.uid) && item.inviteDating?.includes(profile.uid)) {
                listMatch.push(item);
              }
            });
          }

          setList(list);
          setListInvite(listInvite);
          setListInvited(listInvited);
          setListMatch(listMatch);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [profile, tag]);

  React.useEffect(() => {
    if (!profile) return;

    if (
      profile.favorites?.length &&
      profile.targets?.length &&
      profile.country &&
      profile.tall &&
      profile.sex &&
      profile.datingImages?.length
    ) {
      setIsDisplaySettings(false);
      setTag('1');
    } else {
      setIsDisplaySettings(true);
    }
  }, [profile]);

  const onHandleClose = () => {
    handleClose && handleClose();
  };

  const initialValues = {
    country: '',
    tall: '',
    sex: '',
    favorites: [],
    targets: [],
  };

  React.useEffect(() => {
    if (profile?.tall && profile.sex && profile.country && profile.favorites && profile.targets) {
      setValues({
        ...values,
        tall: profile.tall,
        sex: profile.sex,
        country: profile.country,
        favorites: profile.favorites as any,
        targets: profile.targets as any,
      });
    }

    if (profile?.datingImages) {
      setUrls(profile.datingImages);
    }
  }, [profile]);

  const uploadImages = () => {
    if (images?.length < 3) {
      enqueueSnackbar('Please select more image', { variant: 'error' });
      return;
    }

    if (profile && fStore) {
      const uid = profile.uid;

      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(fStorage, `images/dating/${uid}/${Date.now()}${images[i]?.name}`);

        if (imageRef) {
          const uploadTask = uploadBytesResumable(imageRef, images[i]);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error: any) => {
              // Handle unsuccessful uploads
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                if (downloadURL) {
                  setUrls((prev) => [...prev, downloadURL]);
                }
              });
            },
          );
        }
      }

      setTimeout(() => {
        enqueueSnackbar('Update Images Dating Success.', {
          variant: 'success',
        });
      }, 1000);
    }
  };

  const onSubmit = async () => {
    try {
      if (urls.length < 3) {
        enqueueSnackbar('Please upload images');
        return;
      }

      if (profile) {
        await updateDoc(doc(fStore, 'users', profile.uid), {
          datingImages: [],
        });

        await updateDoc(doc(fStore, 'users', profile.uid), {
          country: values.country,
          favorites: values.favorites,
          targets: values.targets,
          tall: values.tall,
          sex: values.sex,
          datingImages: urls,
        });

        await Axios.post(
          `${process.env.NEXT_PUBLIC_NEO4J_API}/user/favorites/${profile.uid}`,
          {
            favorites: values.favorites,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        enqueueSnackbar('Update Expectation Dating Success.', {
          variant: 'success',
        });
        setIsDisplaySettings(false);
        setTag('1');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { values, setValues, errors, handleChange, handleSubmit, submitCount } = useFormik({
    validationSchema: DatingValidationSchema,
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnBlur: true,
  });
  const submited = submitCount > 0;

  const handleChangeCountry = (event: any, newValue: ICountryType | null) => {
    if (newValue) {
      setValues({
        ...values,
        country: newValue.code,
      });
    }
  };

  const handleChangeFavorite = (event: any, newValue: any | null) => {
    if (newValue) {
      setValues({
        ...values,
        favorites: newValue.map((item: any) => item.value),
      });
    }
  };

  const handleChangeTarget = (event: any, newValue: any | null) => {
    if (newValue) {
      setValues({
        ...values,
        targets: newValue.map((item: any) => item.value),
      });
    }
  };

  const handleChangeMultipleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      setImages(event.target.files as any);
      setUrls([]);
    }
  };

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-label" open={open} maxWidth="md">
        <BootstrapDialogTitle id="customized-dialog-label" onClose={onHandleClose} />

        <>
          <SCDialogTitle>Dating</SCDialogTitle>
          <DialogContent>
            {isDisplaySettings ? (
              <TabPanel value="5">
                <SCForm onSubmit={(event) => handleSubmit(event)}>
                  {submited && !!errors.tall && <AlertError severity="error">{errors.tall}</AlertError>}
                  {submited && !!errors.sex && <AlertError severity="error">{errors.sex}</AlertError>}
                  {submited && !!errors.country && <AlertError severity="error">{errors.country}</AlertError>}
                  {submited && values.targets.length === 0 && (
                    <AlertError severity="error">{errors.targets || 'Targets is required'}</AlertError>
                  )}
                  {submited && values.favorites.length === 0 && (
                    <AlertError severity="error">{errors.favorites || 'Favorites is required'}</AlertError>
                  )}

                  <SCTextField
                    id="tall"
                    name="tall"
                    value={values.tall}
                    onChange={handleChange}
                    size="small"
                    placeholder="180cm"
                    label="Tall"
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel id="sex">Sex</InputLabel>
                    <SCSelect
                      labelId="sex"
                      label={'sex'}
                      id="sex"
                      name="sex"
                      value={values.sex}
                      onChange={handleChange}
                      size={'small'}
                    >
                      {sexOption?.length &&
                        sexOption.map((item: ILabelValue) => (
                          <MenuItem key={item.value} value={item.value}>
                            <Box display="flex" gap="0.4rem" alignItems={'center'}>
                              {item.label}
                            </Box>
                          </MenuItem>
                        ))}
                    </SCSelect>
                  </FormControl>

                  <Autocomplete
                    id="country-select-demo"
                    options={CountriesConstant}
                    autoHighlight
                    onChange={(event, newValue) => handleChangeCountry(event, newValue)}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                      </Box>
                    )}
                    renderInput={(params) => {
                      return (
                        <SCTextField
                          {...params}
                          label="Choose a country"
                          size="small"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                        />
                      );
                    }}
                  />

                  {targetItems?.length && (
                    <Autocomplete
                      multiple
                      onChange={(event, newValue) => handleChangeTarget(event, newValue)}
                      id="checkboxes-tags-demo"
                      options={targetItems}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option, { selected }) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <SCTextField {...params} label="Target" />}
                    />
                  )}

                  {favoriteItems?.length && (
                    <Autocomplete
                      multiple
                      onChange={(event, newValue) => handleChangeFavorite(event, newValue)}
                      id="checkboxes-tags-demo"
                      options={favoriteItems}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option, { selected }) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <SCTextField {...params} label="Favorites" />}
                    />
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => handleChangeMultipleImage(event)}
                    style={{ marginBottom: '1rem' }}
                  />
                  {images.length ? (
                    <ImageList sx={{ width: 420, height: 200 }} cols={3} rowHeight={164}>
                      {Array.from(images).map((item: any, index: number) => (
                        <ImageListItem key={index}>
                          <Avatar
                            src={URL.createObjectURL(item)}
                            sx={{ width: '100%', height: '100%' }}
                            variant="rounded"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  ) : (
                    <>
                      {!images.length && profile?.datingImages?.length ? (
                        <ImageList sx={{ width: 420, height: 200 }} cols={3} rowHeight={164}>
                          {profile.datingImages.map((url: string) => (
                            <ImageListItem key={url}>
                              <Avatar src={url} sx={{ width: '100%', height: '100%' }} variant="rounded" />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                  <SCButton type="button" variant="contained" color="secondary" onClick={uploadImages}>
                    Upload Images
                  </SCButton>
                  <SCButton type="submit" variant="contained" color="inherit">
                    Update
                  </SCButton>
                </SCForm>
              </TabPanel>
            ) : (
              <TabContext value={tag}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  {isDisplaySettings ? (
                    <TabList onChange={handleChangeTag} aria-label="lab API tabs example">
                      <Tab
                        label="Opps, please enter more infomation to continue Dating!"
                        value="5"
                        sx={{ maxWidth: '100%' }}
                      />
                    </TabList>
                  ) : (
                    <TabList onChange={handleChangeTag} aria-label="lab API tabs example">
                      <Tab label="Accounts" value="1" />
                      <Tab label="Invite" value="2" />
                      <Tab label="Invited" value="3" />
                      <Tab label="Match" value="4" />
                      {/* <Tab label="Settings" value="5" /> */}
                    </TabList>
                  )}
                </Box>
                <TabPanel value="1">
                  {list?.length
                    ? list.map((account: IAccountItem) => <AccountDatingItem key={account.uid} {...account} />)
                    : ''}
                </TabPanel>
                <TabPanel value="2">
                  {listInvite?.length
                    ? listInvite.map((account: IAccountItem) => <AccountDatingItem key={account.uid} {...account} />)
                    : ''}
                </TabPanel>
                <TabPanel value="3">
                  {listInvited.length
                    ? listInvited.map((account: IAccountItem) => <AccountDatingItem key={account.uid} {...account} />)
                    : ''}
                </TabPanel>
                <TabPanel value="4">
                  {listMatch.length
                    ? listMatch.map((account: IAccountItem) => (
                        <AccountDatingItem
                          key={account.uid}
                          {...account}
                          isMatch
                          handleCloseDatingDialog={handleClose}
                        />
                      ))
                    : ''}
                </TabPanel>
              </TabContext>
            )}
          </DialogContent>
        </>
      </Dialog>
    </div>
  );
}
