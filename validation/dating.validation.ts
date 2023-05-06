import * as Yup from 'yup';

export const DatingValidationSchema = Yup.object().shape({
  sex: Yup.string().required('Sex is required'),
  tall: Yup.string().required('Tall is required'),
  country: Yup.string().required('Country is required'),
  favorites: Yup.array().required('Favorites is required'),
  targets: Yup.array().required('Favorites is required'),
});
