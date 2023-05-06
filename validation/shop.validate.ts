import * as Yup from 'yup';

export const ProductValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  desc: Yup.string().max(150, 'Description less than 150').required('Description is required'),
  price: Yup.number()
    .integer()
    .min(1, 'Price greater than 0')
    .max(999999, 'Price less than 999999')
    .required('Price is required'),
});
