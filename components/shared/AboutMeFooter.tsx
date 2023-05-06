import React from 'react';
import styled from 'styled-components';
import AboutMeItem from '../items/AboutMeItem';
import { collection, getDocs, query } from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import { IFooterItem } from '../../interfaces/common.interface';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useAppSelector } from '../../redux/hooks/hooks';

const SCAboutMeFooterWrapper = styled.div`
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 5rem;

  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const AboutMeFooter = () => {
  const footer = useAppSelector((state) => state.configApp.config?.footerItems);

  return (
    <SCAboutMeFooterWrapper>
      {footer?.length && footer.map((item: IFooterItem) => <AboutMeItem {...item} key={item.value} />)}
    </SCAboutMeFooterWrapper>
  );
};

export default AboutMeFooter;
