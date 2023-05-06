import { Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

const SCCoppyTagWrapper = styled.div`
  margin-top: 1rem;
  margin-left: 1rem;
  color: rgba(22, 24, 35, 0.75);
  font-size: 14px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid rgba(22, 24, 35, 0.12);
  border-radius: 8px;
  overflow: hidden;
  padding: 0.5rem;
  background: none rgba(22, 24, 35, 0.06);
  margin-bottom: 1rem;
`;

const SCTag = styled.p`
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* số dòng hiển thị */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SCCoppy = styled.button`
  border: none;
  outline: none;
  color: rgb(22, 24, 35);
  font-weight: 700;
  cursor: pointer;
`;

const CoppyTag = ({ tag }: { tag: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleCoppy = async () => {
    try {
      await navigator.clipboard.writeText(tag);
      enqueueSnackbar(`Coppy ${tag}`, {
        variant: 'success',
      });
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      /* Rejected - text failed to copy to the clipboard */
    }
  };
  return (
    <SCCoppyTagWrapper>
      <Grid container>
        <Grid item md={11}>
          <SCTag>
            {tag} Lorem ipsum dolor sit amet consectetur adipisicing elit. A dolor velit accusantium laboriosam dolorem
            natus quae aperiam, quam perspiciatis modi quidem sint numquam sed corporis voluptates possimus totam
            inventore nemo!
          </SCTag>
        </Grid>
        <Grid item md={1}>
          <SCCoppy onClick={handleCoppy}>Coppy</SCCoppy>
        </Grid>
      </Grid>
    </SCCoppyTagWrapper>
  );
};

export default CoppyTag;
