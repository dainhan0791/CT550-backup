import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar } from '@mui/material';
import { Check } from '@mui/icons-material';

import styled from 'styled-components';
import { IAccountItem } from '../../interfaces/account.interface';
import { useRouter } from 'next/router';
import { displayName } from '../../utils/display';

const SCAccountItemWrapper = styled.div`
  cursor: pointer;
  width: 100%;
`;
const SCListItem = styled(ListItem)`
  width: 346px;
  align-items: flex-start;
  &:hover {
    background: rgba(22, 24, 35, 0.03);
  }
`;
const SCAccountHeadItem = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SCName = styled.p`
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2rem;
  max-width: 260px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const SCCheckIcon = styled(Check)`
  background: rgb(32, 213, 236);
  width: 0.9rem !important;
  height: 0.9rem !important;
  border-radius: 50%;
  color: white;
`;

const SCAvatar = styled(Avatar)`
  width: 2.4rem;
  height: 2.4rem;
`;

const SCListBodyItem = styled.div`
  margin-left: 0rem;
`;

const SCNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: SofiaPro, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 25px;
  margin-right: 4px;
`;

const SCSubName = styled.p`
  font-family: ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
  font-weight: 400;
  font-size: 0.78rem;
  display: inline-block;
  line-height: 28px;
  color: rgba(22, 24, 35, 0.75);
`;

const AccountItem = (props: IAccountItem) => {
  const router = useRouter();
  const goToUserPage = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();

    if (!props.name) return;
    router.push(`/@${props.name}`);
  };
  return (
    <SCAccountItemWrapper>
      <List>
        <SCListItem onClick={(event) => goToUserPage(event)}>
          <ListItemAvatar>
            <SCAvatar src={props.photoURL} />
          </ListItemAvatar>
          <SCListBodyItem>
            <SCAccountHeadItem style={{ flexDirection: 'column' }}>
              <SCNameWrapper>
                <SCName style={{ fontSize: '0.9rem', lineHeight: '1.2rem' }}>
                  {displayName(props.name, props.uid)}
                </SCName>
                {props.tick && <SCCheckIcon />}
              </SCNameWrapper>
              <SCSubName style={{ lineHeight: '1.2rem' }}>{props.nickname}</SCSubName>
            </SCAccountHeadItem>
          </SCListBodyItem>
        </SCListItem>
      </List>
    </SCAccountItemWrapper>
  );
};

export default AccountItem;
