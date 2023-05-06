import React from 'react';
import { Dialog, DialogTitle, List, Button, Grid } from '@mui/material';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import OtpInput from 'react-otp-input';
import { useFormik } from 'formik';
import styled from 'styled-components';
// Local Import
import { IDialogProps } from '../../interfaces/dialog.interface';
import { LoginValidationSchema } from '../../validation/login.validation';
import {
  LOGIN_TITLE,
  OTP_FIELD_ERROR,
  SEND_SMS_ERROR,
  SEND_SMS_SUCCESS,
  VERTIFY_OTP_SUCCESS,
  VERTIFY_OTP_ERROR,
  VERTIFY_TITLE,
} from '../../constants/login.constant';
// Redux
import { useAppSelector, useAppDispatch } from '../../redux/hooks/hooks';

// Firebase
import { fAuth, fStore } from '../../firebase/init.firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { useSnackbar } from 'notistack';
import DisabledButton from '../common/DisabledButton';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

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
  min-height: 8rem;
  padding: 1rem;
`;
const SCPhoneInput = styled(PhoneInput)`
  width: 240px;
  > div {
    line-height: 30px !important;
  }
  > input {
    line-height: 30px !important;
  }
`;
const SCOtpInput = styled(OtpInput)`
  font-size: 1.8rem;
  > input {
    border-radius: 50%;
  }
`;

const SCButton = styled(Button)`
  width: 100%;
  margin-top: 0.4rem !important;
`;

const LogInDialog = (props: IDialogProps) => {
  const { onClose, open } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [otp, setOtp] = React.useState<string>('');
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);

  const [isOpenVertify, setIsOpenVertify] = React.useState<boolean>(false);

  const handleCloseLoginDialog = () => {
    onClose && onClose();
  };

  const backToSendSMS = () => {
    setIsOpenVertify(false);
  };

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const generateRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response: any) => {
              // enqueueSnackbar('Allow signInWithPhoneNumber', { variant: 'default' });
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              // enqueueSnackbar('Response expired. Ask user to solve reCAPTCHA again', { variant: 'warning' });
            },
          },
          fAuth,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    if (phoneNumber.length < 11 || phoneNumber.length > 12) {
      enqueueSnackbar('Phone Number Error', { variant: 'error' });
      return;
    } else {
      try {
        generateRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        if (fAuth && phoneNumber && appVerifier) {
          signInWithPhoneNumber(fAuth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              // Open vertify otp
              enqueueSnackbar(SEND_SMS_SUCCESS, { variant: 'success' });
              setDisabledButton(true);
              setIsOpenVertify(true);
            })
            .catch((error) => {
              // Error; SMS not sent
              setDisabledButton(false);
              const div = document.createElement('div');
              div.setAttribute('id', 'recaptcha-container');
              document.body.appendChild(div);

              console.log(error);
            });
        }
      } catch (error: any) {
        console.log(error);
        setDisabledButton(false);
        enqueueSnackbar(SEND_SMS_ERROR, { variant: 'error' });
      }
    }
  };

  const vertifySMS = async () => {
    if (otp.length < 6) {
      enqueueSnackbar(OTP_FIELD_ERROR, { variant: 'warning' });
      return;
    }
    try {
      let confirmationResult = window.confirmationResult;
      const UserCredentialImpl = await confirmationResult.confirm(otp);
      if (UserCredentialImpl) {
        if (!fStore) return;

        const docRef = doc(fStore, 'users', UserCredentialImpl.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          enqueueSnackbar(VERTIFY_OTP_SUCCESS, { variant: 'success' });
          handleCloseLoginDialog();
        } else {
          await setDoc(doc(fStore, 'users', UserCredentialImpl.user.uid), {
            uid: UserCredentialImpl.user.uid,
            phoneNumber: UserCredentialImpl.user.phoneNumber,
            tick: false,
            name: '',
            timestamp: serverTimestamp(),
            followers: [],
            following: [],
            totalProducts: 0,
            totalOrder: 0,
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(VERTIFY_OTP_ERROR, { variant: 'error' });
    }
  };

  const { values, errors, handleChange, handleSubmit, submitCount } = useFormik({
    validationSchema: LoginValidationSchema,
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnBlur: true,
  });
  const submited = submitCount > 0;

  return (
    <>
      <Dialog onClose={handleCloseLoginDialog} open={open}>
        <SCDialogTitle>{!isOpenVertify ? LOGIN_TITLE : VERTIFY_TITLE}</SCDialogTitle>
        <List sx={{ pt: 0 }}>
          <SCForm onSubmit={(event) => handleSubmit(event)}>
            {isOpenVertify ? (
              <>
                <SCOtpInput
                  value={otp}
                  onChange={(code: React.SetStateAction<string>) => setOtp(code)}
                  numInputs={6}
                  separator={<span style={{ width: '8px' }}></span>}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  inputStyle={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    width: '46px',
                    height: '46px',
                    fontSize: '12px',
                    color: '#000',
                    fontWeight: '400',
                    caretColor: 'blue',
                  }}
                  focusStyle={{
                    border: '1px solid #CFD3DB',
                    outline: 'none',
                  }}
                />
                <SCButton type="button" variant="contained" color="inherit" onClick={backToSendSMS}>
                  Back
                </SCButton>
                <SCButton type="button" variant="contained" color="success" onClick={vertifySMS}>
                  Vertify
                </SCButton>
              </>
            ) : (
              <>
                <SCPhoneInput
                  id="phoneNumber"
                  defaultCountry="VN"
                  country="ca"
                  value={phoneNumber}
                  onChange={(number: any) => setPhoneNumber(number)}
                />
                {disabledButton ? (
                  <DisabledButton setToggle={setDisabledButton} />
                ) : (
                  <SCButton type="submit" color="info" variant="contained">
                    Log in
                  </SCButton>
                )}
              </>
            )}
          </SCForm>
        </List>
      </Dialog>
    </>
  );
};

export default LogInDialog;
