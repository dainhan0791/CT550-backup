import React from 'react';
import { Box, Button } from '@mui/material';
import { fStore } from '../../firebase/init.firebase';
import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { IDiscoverItem } from '../../interfaces/discover.interface';
import { IFooterItem } from '../../interfaces/common.interface';
import { ILabelValue } from '../../interfaces/config.interface';

const index = () => {
  const discover: Array<IDiscoverItem> = [
    {
      did: '1',
      icon: 'hashtag-solid.svg',
      label: 'test1',
      value: 'Test1',
    },
    {
      did: '2',
      icon: 'hashtag-solid.svg',
      label: 'test2',
      value: 'Test2',
    },
  ];

  const footer: Array<IFooterItem> = [
    {
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      label: 'Privacy',
      value: 'privacy',
    },
    {
      value: 'contact',
      label: 'Contact',
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
    },
    {
      label: 'Developers',
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      value: 'developers',
    },
    {
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      value: 'help',
      label: 'Help',
    },
    {
      label: 'Terms',
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      value: 'terms',
    },
    {
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      value: 'about',
      label: 'About',
    },
    {
      value: 'safety',
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
      label: 'Safety',
    },
    {
      value: 'careers',
      label: 'Carreers',
      href: 'https://www.facebook.com/profile.php?id=100076244270730',
    },
  ];

  const favorites: Array<ILabelValue> = [
    {
      label: 'Cafe',
      value: 'cafe',
    },
    {
      label: 'Food',
      value: 'food',
    },
    {
      label: 'Walk',
      value: 'walk',
    },
    {
      label: 'Football',
      value: 'football',
    },
    {
      label: 'Travel',
      value: 'travel',
    },
    {
      label: 'Music',
      value: 'music',
    },
    {
      label: 'Movie',
      value: 'movie',
    },
    {
      label: 'Camping',
      value: 'camping',
    },
  ];

  const target: Array<ILabelValue> = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'LGBT ',
      value: 'lgbt',
    },
  ];

  const addDiscover = async () => {
    const ref = doc(fStore, 'config', 'discover');

    try {
      if (discover.length) {
        discover.forEach(async (item: IDiscoverItem, index: number) => {
          return await updateDoc(ref, {
            hashtags: arrayUnion(item),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFooter = async () => {
    const ref = doc(fStore, 'config', 'footer');

    try {
      if (footer.length) {
        footer.forEach(async (item: IFooterItem, index: number) => {
          return await updateDoc(ref, {
            footerItems: arrayUnion(item),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTarget = async () => {
    const ref = doc(fStore, 'config', 'target');

    try {
      if (target.length) {
        target.forEach(async (item: ILabelValue, index: number) => {
          return await updateDoc(ref, {
            targetItems: arrayUnion(item),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFavorites = async () => {
    const ref = doc(fStore, 'config', 'favorites');
    try {
      if (favorites.length) {
        favorites.forEach(async (item: ILabelValue, index: number) => {
          return await updateDoc(ref, {
            favoriteItems: arrayUnion(item),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addDataToFirebase = () => {
    if (addFavorites) {
      addFavorites();
    }
    // alert('No Access To Firebase');
  };

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
      <Button variant="contained" onClick={addDataToFirebase}>
        Add Data To Firebase
      </Button>
    </Box>
  );
};

export default index;
