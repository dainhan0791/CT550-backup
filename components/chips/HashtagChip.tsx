import React from 'react';
import { Chip } from '@mui/material';
import { Tag } from '@mui/icons-material';
import styled from 'styled-components';
import { toUpperCaseFirstLetter } from '../../utils/display';

interface IChipProps {
  isVideo: boolean;
}

const SCChip = styled(Chip)<IChipProps>`
  margin-top: -0.4rem;
  border: none;
  cursor: pointer;
  color: rgba(22, 24, 35, 1);
  font-weight: bold;
  border: ${(props) => props.isVideo && 'none !important'};
`;

const HashtagChip = ({ hashtag, isVideo }: { hashtag: string; isVideo?: boolean }) => {
  return (
    <>
      {hashtag ? (
        <SCChip
          icon={<Tag />}
          label={toUpperCaseFirstLetter(hashtag, '-')}
          variant="outlined"
          isVideo={isVideo || false}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default HashtagChip;
