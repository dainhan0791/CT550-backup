import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object().shape({
  // password: Yup.string().required().min(6),
  // confirmPassword: Yup.string()
  //   .required()
  //   .min(6)
  //   .oneOf([Yup.ref('password')], 'Confirm Password Invalid'),
});
