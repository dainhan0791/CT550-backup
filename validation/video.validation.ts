import * as Yup from 'yup';

export const VideoValidationSchema = Yup.object().shape({
  desc: Yup.string().required('Please enter description'),
  hashtag: Yup.string().required('Please select hashtag'),
});
