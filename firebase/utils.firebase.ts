import { signOut } from 'firebase/auth';
import { fAuth } from './init.firebase';

export const handleSignOutFirebase = async () => {
  if (!fAuth) return;
  try {
    await signOut(fAuth);
  } catch (error) {
    console.log(error);
  }
};
