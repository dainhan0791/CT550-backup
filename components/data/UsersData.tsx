import { Skeleton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { IAccountItem } from '../../interfaces/account.interface';
import AccountSearchItem from '../items/AccountSearchItem';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
const UsersDataWrap = styled.div`
  width: 360px !important;
  min-height: 120px;
  background-color: red;
  position: absolute;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 12px;
  max-height: min((100vh - 96px) - 60px, 734px);
  overflow: hidden auto;
  list-style-type: none;
  top: 3.8rem;
  left: 28.5rem;
  z-index: 3;
  max-height: 300px;
`;

const SCNoData = styled.div`
  margin-top: 1rem;
  color: rgba(255, 44, 85, 1);
  font-size: 0.9rem;
  gap: 1rem;
`;

interface IUsersData {
  users: Array<IAccountItem>;
}

const UsersData = (props: IUsersData) => {
  return (
    <UsersDataWrap>
      {props.users.length ? (
        props.users.map((user: IAccountItem) => <AccountSearchItem key={user.uid} {...user} />)
      ) : (
        <SCNoData>
          <SentimentVeryDissatisfiedIcon />
          <p>No Users Found!</p>
        </SCNoData>
      )}
    </UsersDataWrap>
  );
};

export default UsersData;
