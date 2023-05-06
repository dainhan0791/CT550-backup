import { ICountryType } from './../interfaces/account.interface';
import * as Yup from 'yup';

export const ProfileValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  nickname: Yup.string().required('Nickname is required'),
  // country: Yup.string().required('Country is required'),
  // target: Yup.string().required('Target is required'),
  email: Yup.string().required('Email is required').email('Email is not valid'),

  // password: Yup.string().required().min(6),
  // confirmPassword: Yup.string()
  //   .required()
  //   .min(6)
  //   .oneOf([Yup.ref('password')], 'Confirm Password Invalid'),
});
