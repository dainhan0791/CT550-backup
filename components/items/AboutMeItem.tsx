import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { IFooterItem } from '../../interfaces/common.interface';

const SCAboutMeLink = styled.div`
  color: rgba(22, 24, 35, 0.5);
  font-weight: 600;
  font-size: 12px;
  line-height: 17px;
  display: inline-block;
  margin-right: 6px;
  margin-top: 5px;
  cursor: pointer;
  &:hover {
    color: rgba(255, 44, 85, 1);
  }
`;

const AboutMeLink = (props: IFooterItem) => {
  const handleGoToLink = () => {
    if (props.href) {
      window.location.href = props.href;
    }
  };
  return <SCAboutMeLink onClick={handleGoToLink}>{props.label}</SCAboutMeLink>;
};

export default AboutMeLink;
