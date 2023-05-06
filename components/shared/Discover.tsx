import React from 'react';
import styled from 'styled-components';
import { IDiscoverItem } from '../../interfaces/discover.interface';
import DiscoverItem from '../items/DiscoverItem';

const SCDiscoverWrapper = styled.div`
  padding: 1rem;
`;
const SCLabel = styled.p`
  color: rgba(22, 24, 35, 0.75);
  font-weight: 0.9rem;
  font-size: 14px;
  line-height: 20px;
`;

const SCChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0.5rem;
`;

const Discover = ({ discover }: { discover: Array<IDiscoverItem> }) => {
  return (
    <SCDiscoverWrapper>
      <SCLabel>Discover</SCLabel>
      <SCChipWrapper>
        {discover?.length &&
          discover.map((chip) => (
            <>
              <DiscoverItem key={chip.did} chip={chip} />
            </>
          ))}
      </SCChipWrapper>
    </SCDiscoverWrapper>
  );
};

export default Discover;
