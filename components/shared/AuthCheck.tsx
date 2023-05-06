import React from 'react';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { setAccounts, setProfile } from '../../redux/slices/account.slice';
import { fAuth, fStore } from '../../firebase/init.firebase';
import { setIsLogin } from '../../redux/slices/auth.slice';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { setFeeds } from '../../redux/slices/feeds.slice';
import { IVideoItem } from '../../interfaces/video.interface';
import { IAccountItem } from '../../interfaces/account.interface';
import { IConfigRes, IConfigs } from '../../interfaces/config.interface';
import { setConfigApp } from '../../redux/slices/config.slice';
const AuthCheck = (props: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isDisplayDOM, setIsDisplayDOM] = React.useState<boolean>(false);

  const getProfileFromFirebase = async (uid: string) => {
    try {
      if (!uid) return;
      onSnapshot(doc(fStore, 'users', uid), (doc) => {
        const profile = doc.data() as IAccountItem;
        dispatch(setProfile(profile));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getVideos = async () => {
    try {
      const q = query(collection(fStore, 'videos'));
      onSnapshot(q, (querySnapshot) => {
        const data: Array<IVideoItem> = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as IVideoItem);
        });
        dispatch(setFeeds({ videos: data }));
        setIsDisplayDOM(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAccounts = async () => {
    try {
      const q = query(collection(fStore, 'users'), orderBy('followers', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        const data: Array<IAccountItem> = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as IAccountItem);
        });

        dispatch(setAccounts(data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getConfig = async () => {
    try {
      const q = query(collection(fStore, 'config'));
      const querySnapshot = await getDocs(q);

      const configs: any = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        configs.push(doc.data());
      });

      // configs.sort();

      dispatch(
        setConfigApp({
          hashtags: configs[0].hashtags,
          favoriteItems: configs[1].favoriteItems,
          footerItems: configs[2].footerItems,
          targetItems: configs[3].targetItems,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRouteChange = (url: string, shallow: boolean) => {
    console.log(shallow);

    console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
  };

  React.useEffect(() => {
    onAuthStateChanged(fAuth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        getProfileFromFirebase(uid);
        dispatch(setIsLogin(true));
      } else {
        // User is signed out
        dispatch(setIsLogin(false));
      }
    });
    getAccounts();
    getVideos();
    getConfig();

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  if (isDisplayDOM) {
    return props.children;
  }
};

export default AuthCheck;
