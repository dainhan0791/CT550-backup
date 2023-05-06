import { Divider } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { fStore } from '../../firebase/init.firebase';
import { IDiscoverItem } from '../../interfaces/discover.interface';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import LeftSideBarLogInTo from '../common/LeftSideBarLogInTo';
import LeftSideBarMenu from '../menus/LeftSideBarMenu';
import AboutMeFooter from './AboutMeFooter';
import Discover from './Discover';
import FollowingList from './FollowingList';
import SuggestedAccounts from './SuggestedAccounts';

const SCLeftNavBarWapper = styled.div`
  width: 100%;
`;
const SCBox = styled.div`
  width: 100% !important;
`;

const SCDivider = styled(Divider)`
  margin: 0 1rem;
  height: 1px;
`;

const LeftSideBar = () => {
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const hashtags = useAppSelector((state) => state.configApp.config?.hashtags);

  return (
    <SCLeftNavBarWapper>
      <SCBox>
        <LeftSideBarMenu />
        <SCDivider />
      </SCBox>

      {!isLogin && (
        <SCBox>
          <LeftSideBarLogInTo />
          <SCDivider />
        </SCBox>
      )}

      <SCBox>
        <SuggestedAccounts />
        <SCDivider />
      </SCBox>

      <SCBox>
        <FollowingList />
        <SCDivider />
      </SCBox>

      <SCBox>
        {hashtags && <Discover discover={hashtags} />}
        <SCDivider />
      </SCBox>
      <SCBox>
        <AboutMeFooter />
      </SCBox>
    </SCLeftNavBarWapper>
  );
};

export default LeftSideBar;
