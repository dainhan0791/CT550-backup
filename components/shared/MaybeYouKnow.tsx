import React from 'react';

import styled from 'styled-components';
import AccountItem from '../items/AccountItem';
// firebase
import { collection, getDocs, query } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { IAccountItem } from '../../interfaces/account.interface';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { Skeleton } from '@mui/material';
import { hideSuggestedAccounts, seeAllSuggestedAccounts } from '../../redux/slices/account.slice';
import { displaySeeAll } from '../../utils/display';
import Axios from 'axios';

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

const MaybeYouKnow = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.account.profile);
  const accounts = useAppSelector((state) => state.account.accounts);

  const [data, setData] = React.useState<Array<IAccountItem>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!profile) return;
        if (!accounts) return;

        const res = await Axios.get(`${process.env.NEXT_PUBLIC_NEO4J_API}/user/friends/${profile.uid}`);

        console.log(res);

        if (res.data?.length) {
          const unique = res.data.filter((c: IAccountItem, index: number) => {
            return res.data.indexOf(c) === index;
          });

          const result: Array<IAccountItem> = accounts.filter((item: IAccountItem) => unique.includes(item.uid));

          if (result) {
            setData(result);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [profile]);

  return (
    <div>
      {data?.length && profile ? (
        <SCSuggestedAccountsWrapper>
          <SCSuggestedAccountsLabel>Maybe You Know</SCSuggestedAccountsLabel>
          <div>
            {data.map((account: IAccountItem) => (
              <AccountItem
                key={account.uid}
                uid={account.uid}
                name={account.name}
                nickname={account.nickname}
                photoURL={account.photoURL}
                tick={account.tick}
                email={account.email}
                followers={[]}
              />
            ))}
          </div>
          {/* <SCSeeAll onClick={handleSeeAll}>{displaySeeAll(seeAll)}</SCSeeAll> */}
        </SCSuggestedAccountsWrapper>
      ) : (
        ''
      )}
    </div>
  );
};

export default MaybeYouKnow;
