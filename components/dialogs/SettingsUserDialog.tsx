import React from 'react';
import 'react-phone-number-input/style.css';
import { Dialog, DialogTitle, List, TextField, Button, Avatar, Autocomplete, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

import { useFormik } from 'formik';
import styled from 'styled-components';

// Local Import
import { IDialogProps } from '../../interfaces/dialog.interface';
import { useSnackbar } from 'notistack';
import { NO_SELECT_AVATAR_FILE, UPLOAD_PROFILE_ERROR, UPLOAD_PROFILE_SUCCESS } from '../../constants/upload';
import { setProfile } from '../../redux/slices/account.slice';
import { removeAccents, removeSpaceText } from '../../utils/validate';
import AlertError from '../common/AlertError';
import RedLoader from '../loaders/RedLoader';
// Redux
import { useAppSelector, useAppDispatch } from '../../redux/hooks/hooks';
// Firebase
import { fAuth, fStorage, fStore } from '../../firebase/init.firebase';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { ProfileValidationSchema } from '../../validation/profile.validation';
import Grid2 from '@mui/material/Unstable_Grid2';

const SCForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 10rem;
  padding: 1rem;
`;

const SCTextField = styled(TextField)`
  width: 240px !important;
  margin-bottom: 1rem !important;
`;
const SCButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: flex-end;
  margin-top: 0.5rem !important;
`;

const SCUpload = styled(SCButton)`
  &:hover {
    background-color: rgba(255, 44, 85, 0.5);
  }
  background-color: rgba(255, 44, 85, 1);
`;
const SCAvatarPreview = styled(Avatar)`
  margin-bottom: 1rem !important;
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

const SettingsUserDialog = (props: IDialogProps) => {
  const profile = useAppSelector((state) => state.account.profile);
  const accounts = useAppSelector((state) => state.account.accounts);
  const names = useAppSelector((state) => state.account.names);

  const { onClose, open } = props;

  // file
  const inputRef = React.useRef<any>();
  const [file, setFile] = React.useState<any>();
  const [progress, setProgress] = React.useState<any>();

  const [isExitingName, setIsExitingName] = React.useState<boolean>(false);
  const [exitingNameValue, setExitingNameValue] = React.useState<string>('');

  // snackbar
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseLoginDialog = () => {
    onClose && onClose();
    setIsExitingName(false);
  };

  React.useEffect(() => {
    return () => {
      file && URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  React.useEffect(() => {
    if (!profile) return;
    setValues({
      name: profile.name,
      nickname: profile.nickname,
      email: profile.email,
    });
  }, [open]);

  const initialValues = {
    name: '',
    nickname: '',
    email: '',
  };

  const onSubmit = async () => {
    try {
      if (!profile) return;
      if (!accounts) return;
      if (!names) return;

      if (names.includes(values.name)) {
        setIsExitingName(true);
        setExitingNameValue(values.name);
        return;
      }

      if (!file) {
        await updateDoc(doc(fStore, 'users', profile.uid), {
          uid: profile.uid,
          name: removeSpaceText(values.name),
          nickname: removeSpaceText(values.nickname),
          email: removeSpaceText(values.email),
          noAccentName: removeAccents(`${values.name} ${values.nickname}`),
          timestampUpdate: serverTimestamp(),
        });

        enqueueSnackbar(UPLOAD_PROFILE_SUCCESS, { variant: 'success' });
        handleCloseLoginDialog();
      }

      if (fStorage && profile && file && values.name) {
        const imageRef = ref(fStorage, `images/avatar/${values.name}/${Date.now()}${file.name}`);

        const uploadTask = uploadBytesResumable(imageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress && setProgress(progress.toFixed());
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                'Upload is running';
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            enqueueSnackbar(error.message, { variant: 'error' });
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              if (downloadURL && profile) {
                await updateDoc(doc(fStore, 'users', profile.uid), {
                  uid: profile.uid,
                  name: removeSpaceText(values.name),
                  nickname: removeSpaceText(values.nickname),
                  noAccentName: removeAccents(`${values.name} ${values.nickname}`),
                  email: removeSpaceText(values.email),
                  photoURL: downloadURL,
                  timestampUpdate: serverTimestamp(),
                });

                // upload sucess
                enqueueSnackbar(UPLOAD_PROFILE_SUCCESS, { variant: 'success' });
                setProgress(null);

                handleCloseLoginDialog();
              } else {
                // upload failed
                enqueueSnackbar(UPLOAD_PROFILE_ERROR, { variant: 'error' });
                setProgress(null);
              }
            });
          },
        );
      }
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(UPLOAD_PROFILE_ERROR, { variant: 'error' });
      setProgress(null);
    }
  };

  const { values, setValues, errors, handleChange, handleSubmit, submitCount } = useFormik({
    validationSchema: ProfileValidationSchema,
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnBlur: true,
  });
  const submited = submitCount > 0;

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setFile(file);
    }
  };

  return (
    <>
      <Dialog onClose={handleCloseLoginDialog} open={open}>
        {!!progress ? (
          <RedLoader progress={progress} />
        ) : (
          <>
            <SCDialogTitle>Setting Profile</SCDialogTitle>
            <List sx={{ pt: 0 }}>
              <SCForm onSubmit={(event) => handleSubmit(event)}>
                {submited && isExitingName && exitingNameValue && (
                  <AlertError severity="error"> {exitingNameValue} is Exiting</AlertError>
                )}

                {submited && !!errors.name && <AlertError severity="error"> {errors.name}</AlertError>}
                {submited && !!errors.nickname && <AlertError severity="error">{errors.nickname}</AlertError>}
                {submited && !!errors.email && <AlertError severity="error">{errors.email}</AlertError>}
                {file?.preview && <SCAvatarPreview src={file.preview} sx={{ width: 46, height: 46 }} />}
                {profile?.photoURL && !file?.preview && (
                  <SCAvatarPreview src={profile.photoURL} sx={{ width: 46, height: 46 }} />
                )}

                <SCTextField
                  id="name"
                  variant="outlined"
                  size="small"
                  label="Name *"
                  value={values.name}
                  onChange={handleChange}
                />

                <SCTextField
                  id="nickname"
                  variant="outlined"
                  size="small"
                  label="Nickname *"
                  value={values.nickname}
                  onChange={handleChange}
                />

                <SCTextField
                  id="email"
                  variant="outlined"
                  size="small"
                  label="Email *"
                  value={values.email}
                  onChange={handleChange}
                />

                <SCUpload variant="contained" size="small" onClick={() => inputRef.current.click()}>
                  <ImageIcon />
                  <p>Upload Avatar</p>
                  <input type="file" ref={inputRef} hidden accept="image/*" onChange={(event) => onFileChange(event)} />
                </SCUpload>

                <SCButton type="submit" variant="contained" color="inherit">
                  Update
                </SCButton>
              </SCForm>
            </List>
          </>
        )}
        <div id="recaptcha-container"></div>
      </Dialog>
    </>
  );
};

export default SettingsUserDialog;
