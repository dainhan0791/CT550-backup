import React from 'react';

import styled from 'styled-components';
import AccountItem from '../items/AccountItem';
// firebase
import { collection, getDocs, query } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { IAccountItem } from '../../interfaces/account.interface';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { Skeleton } from '@mui/material';
import { displaySeeAll } from '../../utils/display';
import { hideFollowingAccounts, seeAllFollowingAccounts } from '../../redux/slices/account.slice';

const SCSuggestedAccountsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 18rem;
`;
const SCSuggestedAccountsLabel = styled.p`
  margin: 1rem 1rem 0 1rem;
  color: rgba(22, 24, 35, 0.6);
  font-weight: 600;
`;

const SCSeeAll = styled.p`
  color: rgb(254, 44, 85);
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-left: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const FollowingList = () => {
  const dispatch = useAppDispatch();

  const followingAccounts = useAppSelector((state) => state.account.followingAccountsView);
  const [seeAll, setSeeAll] = React.useState<boolean>(false);

  const handleSeeAll = () => {
    if (seeAll) {
      setSeeAll(false);
      dispatch(hideFollowingAccounts());
    } else {
      setSeeAll(true);
      dispatch(seeAllFollowingAccounts());
    }
  };
  return (
    <SCSuggestedAccountsWrapper>
      <SCSuggestedAccountsLabel>Following accounts</SCSuggestedAccountsLabel>
      {!followingAccounts && (
        <Skeleton variant="rounded" style={{ width: '100%', height: '18rem' }}>
          <AccountItem
            name={''}
            nickname={''}
            photoURL={''}
            tick={false}
            uid={''}
            email={''}
            timestamp={undefined}
            timestampUpdate={undefined}
            followers={[]}
          />
        </Skeleton>
      )}
      {followingAccounts &&
        followingAccounts.map((account: IAccountItem) => (
          <AccountItem
            key={account.uid}
            uid={account.uid}
            name={account.name}
            nickname={account.nickname}
            photoURL={account.photoURL}
            tick={account.tick}
            email={account.email}
            followers={account.followers}
          />
        ))}
      <SCSeeAll onClick={handleSeeAll}>{displaySeeAll(seeAll)}</SCSeeAll>
    </SCSuggestedAccountsWrapper>
  );
};

export default FollowingList;
