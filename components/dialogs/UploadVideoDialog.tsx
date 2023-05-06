import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  List,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Movie } from '@mui/icons-material';

import 'react-phone-number-input/style.css';
import { useFormik } from 'formik';
import styled from 'styled-components';
// Local Import
import { IDialogProps } from '../../interfaces/dialog.interface';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { VideoValidationSchema } from '../../validation/video.validation';
import VideoPreview from '../common/PreviewVideo';
import { useSnackbar } from 'notistack';
import { NO_SELECT_VIDEO_FILE, UPLOAD_VIDEO_FAILED, UPLOAD_VIDEO_SUCCESS } from '../../constants/upload';
import RedLoader from '../loaders/RedLoader';
// Redux
import { useAppSelector, useAppDispatch } from '../../redux/hooks/hooks';
// Firebase
import { fAuth, fStorage, fStore } from '../../firebase/init.firebase';

import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { guid } from '../../utils/generates';
import { IDiscoverItem } from '../../interfaces/discover.interface';
import AlertError from '../common/AlertError';

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
  min-height: 10rem;
  padding: 1rem;
`;

const SCTextField = styled(TextField)`
  width: 240px;
  margin-bottom: 1rem !important;
`;
const SCSelect = styled(Select)`
  width: 240px;
  margin-bottom: 1rem;
`;

const SCError = styled.p`
  color: red;
  text-align: center;
  width: 100%;
  margin: 0.1rem 0;
  line-height: 1rem;
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

const UploadVideoDialog = (props: IDialogProps) => {
  const { onClose, open } = props;
  const profile = useAppSelector((state) => state.account.profile);
  const hashtags = useAppSelector((state) => state.configApp.config?.hashtags);

  const { enqueueSnackbar } = useSnackbar();

  const inputRef = React.useRef<any>();

  const [file, setFile] = React.useState<any>();
  const [progress, setProgress] = React.useState<any>();

  const handleCloseUploadVideoDialog = () => {
    onClose && onClose();
  };

  const initialValues = {
    desc: '',
    hashtag: '',
  };

  React.useEffect(() => {
    return () => {
      file && URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  const onSubmit = async () => {
    if (!file) {
      enqueueSnackbar(NO_SELECT_VIDEO_FILE, { variant: 'error' });
    }
    try {
      if (!profile) return;
      if (!values) return;
      // 'file' comes from the Blob or File API
      if (file && profile) {
        const videoRef = ref(fStorage, `videos/${values.hashtag}/${profile.name}/${Date.now()}${file.name}`);
        const uploadTask = uploadBytesResumable(videoRef, file);
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
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            console.log(error);
            // Handle unsuccessful uploads
            enqueueSnackbar(UPLOAD_VIDEO_FAILED, { variant: 'error' });
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              const vid = guid();
              try {
                if (downloadURL && profile) {
                  await setDoc(doc(fStore, 'videos', vid), {
                    uid: profile.uid,
                    vid: vid,
                    desc: values.desc,
                    hashtag: values.hashtag,
                    url: downloadURL,
                    likes: [],
                    views: [],
                    share: [],
                    comments: 0,
                    timestamp: serverTimestamp(),
                  });

                  enqueueSnackbar(UPLOAD_VIDEO_SUCCESS, { variant: 'success' });
                  setProgress(null);

                  handleCloseUploadVideoDialog();
                }
              } catch (error) {
                enqueueSnackbar(UPLOAD_VIDEO_FAILED, { variant: 'error' });
                setProgress(null);

                handleCloseUploadVideoDialog();
              }
            });
          },
        );
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(UPLOAD_VIDEO_FAILED, { variant: 'error' });
      setProgress(null);
    }
  };

  const { values, errors, handleChange, handleSubmit, submitCount } = useFormik({
    validationSchema: VideoValidationSchema,
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnBlur: true,
  });
  const submited = submitCount > 0;

  const onFileChange = (event: any) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 50000000) {
      enqueueSnackbar('File size must less than 48MB', {
        variant: 'error',
      });
    } else {
      file.preview = URL.createObjectURL(file);
      setFile(file);
    }
  };

  return (
    <>
      <Dialog onClose={handleCloseUploadVideoDialog} open={open} maxWidth="xl">
        {progress ? (
          <RedLoader progress={progress} />
        ) : (
          <>
            <SCDialogTitle textAlign={'center'}>Upload Video</SCDialogTitle>
            <Grid container display="flex" alignItems="flex-end" sx={{ maxHeight: '100%' }}>
              <Grid item md>
                {file && <VideoPreview hashtag={'Preview Video'} url={file.preview} />}
              </Grid>
              <Grid item md>
                <List sx={{ pt: 0 }}>
                  <SCForm onSubmit={(event) => handleSubmit(event)}>
                    {submited && !!errors.desc && <AlertError severity="error"> {errors.desc}</AlertError>}
                    {submited && !!errors.hashtag && <AlertError severity="error">{errors.hashtag}</AlertError>}
                    {/* desc */}
                    <SCTextField
                      id="desc"
                      variant="outlined"
                      size="small"
                      label="Description *"
                      value={values.desc}
                      onChange={handleChange}
                    />

                    {/* hashtag */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="hashtag">Hashtag</InputLabel>
                      <SCSelect
                        label={'Hashtag'}
                        labelId="hashtag"
                        id="hashtag"
                        name="hashtag"
                        value={values.hashtag}
                        onChange={handleChange}
                      >
                        {hashtags?.length &&
                          hashtags.map((hashtag: IDiscoverItem) => (
                            <MenuItem key={hashtag.did} value={hashtag.value}>
                              <Box display="flex" gap="0.4rem" alignItems={'center'}>
                                <Image src={`/discover/${hashtag.icon}`} alt={hashtag.icon} width={14} height={14} />
                                {hashtag.label}
                              </Box>
                            </MenuItem>
                          ))}
                      </SCSelect>
                    </FormControl>

                    <SCUpload variant="contained" size="small" onClick={() => inputRef.current.click()}>
                      <Movie />
                      <p>Upload Video</p>
                      <input
                        type="file"
                        ref={inputRef}
                        hidden
                        accept=".mp4"
                        onChange={(event) => onFileChange(event)}
                      />
                    </SCUpload>

                    <SCButton type="submit" variant="contained" color="inherit">
                      Upload
                    </SCButton>
                  </SCForm>
                </List>
              </Grid>
            </Grid>
            <div id="recaptcha-container"></div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default UploadVideoDialog;
