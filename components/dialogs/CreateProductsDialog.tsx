import React from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ImageIcon from '@mui/icons-material/Image';

import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { IProduct } from '../../interfaces/shop.interface';
import { ProductValidationSchema } from '../../validation/shop.validate';
import { List, TextField, Avatar } from '@mui/material';

import AlertError from '../common/AlertError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';

// Firebase
import { fAuth, fStorage, fStore } from '../../firebase/init.firebase';
import { doc, setDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { guid } from '../../utils/generates';
import RedLoader from '../loaders/RedLoader';

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

const SCForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 8rem;
  padding: 1rem;
`;

const SCButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: flex-end;
  margin-top: 0.5rem !important;
`;

const SCTextField = styled(TextField)`
  width: 240px !important;
  margin-bottom: 1rem !important;
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

export default function CreateProductsDialog({ open, handleClose }: { open: boolean; handleClose: Function }) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.account.profile);

  const { enqueueSnackbar } = useSnackbar();

  // file
  const inputRef = React.useRef<any>();
  const [file, setFile] = React.useState<any>();
  const [progress, setProgress] = React.useState<any>();

  React.useEffect(() => {
    return () => {
      file && URL.revokeObjectURL(file.preview);
    };
  }, [file]);
  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setFile(file);
    }
  };

  const onHandleClose = () => {
    handleClose && handleClose();
  };

  const onSubmit = async () => {
    if (!values) return;
    if (!file) {
      enqueueSnackbar('Please select a product image', {
        variant: 'error',
      });
    }

    try {
      if (fStorage && profile && file) {
        const imageRef = ref(fStorage, `images/products/${profile.uid}/${Date.now()}${file.name}`);

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
                const pid = guid();

                await setDoc(doc(fStore, 'products', pid), {
                  pid: pid,
                  uid: profile.uid,
                  name: values.name,
                  desc: values.desc,
                  price: values.price,
                  url: downloadURL,
                  timestamp: serverTimestamp(),
                });

                await updateDoc(doc(fStore, 'users', profile.uid), {
                  totalProducts: increment(1),
                });

                // upload sucess
                enqueueSnackbar('Create Product Success.', { variant: 'success' });
                setProgress(null);
                setFile(null);

                handleClose();

                router.push(`/@${profile.name}`);
              } else {
                // upload failed
                enqueueSnackbar('Create Product Failer', { variant: 'error' });
                setProgress(null);
              }
            });
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    name: '',
    desc: '',
    price: null,
  };

  const { values, errors, handleChange, handleSubmit, submitCount } = useFormik({
    validationSchema: ProductValidationSchema,
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnBlur: true,
  });

  const submited = submitCount > 0;

  return (
    <div>
      <Dialog onClose={onHandleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xl">
        {!!progress ? (
          <RedLoader progress={progress} />
        ) : (
          <>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={onHandleClose}></BootstrapDialogTitle>
            <SCDialogContent>
              <SCHeadWrapper>
                <SCHeadContact>Create Product</SCHeadContact>
              </SCHeadWrapper>

              <List sx={{ pt: 0 }}>
                <SCForm onSubmit={(event) => handleSubmit(event)}>
                  {submited && !!errors.name && <AlertError severity="error"> {errors.name}</AlertError>}
                  {submited && !!errors.desc && <AlertError severity="error">{errors.desc}</AlertError>}
                  {submited && !!errors.price && <AlertError severity="error">{errors.price}</AlertError>}

                  {file && file?.preview && (
                    <SCAvatarPreview variant="rounded" src={file.preview} sx={{ width: 240, height: 265 }} />
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
                    id="desc"
                    variant="outlined"
                    size="small"
                    label="Description *"
                    value={values.desc}
                    onChange={handleChange}
                  />

                  <SCTextField
                    id="price"
                    type="number"
                    variant="outlined"
                    size="small"
                    label="Price *"
                    value={values.price}
                    onChange={handleChange}
                  />

                  <SCUpload variant="contained" color="inherit" size="small" onClick={() => inputRef.current.click()}>
                    <ImageIcon />
                    <p>Upload Image</p>
                    <input
                      type="file"
                      ref={inputRef}
                      hidden
                      accept="image/*"
                      onChange={(event) => onFileChange(event)}
                    />
                  </SCUpload>

                  <SCButtonWrapper>
                    <SCCancelButton onClick={onHandleClose} variant="contained">
                      Cancel
                    </SCCancelButton>
                    <SCSentButton variant="contained" type="submit">
                      Create
                    </SCSentButton>
                  </SCButtonWrapper>
                </SCForm>
              </List>
            </SCDialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
