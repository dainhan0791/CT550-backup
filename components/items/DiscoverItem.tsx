import React from 'react';
import Image from 'next/image';
import { Chip } from '@mui/material';
import styled from 'styled-components';
import { IDiscoverItem } from '../../interfaces/discover.interface';
import { useRouter } from 'next/router';

const SCChip = styled(Chip)`
  margin-top: 0.4rem;
  cursor: pointer;
  font-size: 0.6rem !important;
`;

const createIcon = (icon: string) => {
  return <Image src={`/discover/${icon}`} alt={icon} width={12} height={12} />;
};

const DiscoverItem = ({ chip }: { chip: IDiscoverItem }) => {
  const router = useRouter();

  const goToDiscoverFeeds = () => {
    if (!chip) return;

    router.push(`/discover/${chip.value}`);
  };

  return <SCChip onClick={goToDiscoverFeeds} icon={createIcon(chip.icon)} label={chip.label} variant="outlined" />;
};

export default DiscoverItem;
