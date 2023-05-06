import React from 'react';
import styled from 'styled-components';
import { Favorite, Textsms, Share } from '@mui/icons-material';
import { IVideo, IVideoActions } from '../../interfaces/video.interface';
import HashtagChip from '../chips/HashtagChip';
import { displayK } from '../../utils/display';

const SCVideoActionWrapper = styled.div`
  display: flex;

  gap: 1rem;
  padding-left: 1rem;
  margin-top: 1rem;
`;
const SCVideoActionInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &:hover {
    opacity: 0.7;
  }
`;

const SCButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  background-color: rgba(22, 24, 35, 0.18);
  border-radius: 100%;
  width: 32px;
  height: 32px;
`;
const SCView = styled.p`
  color: rgba(22, 24, 35, 0.75);
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  font-weight: 500;
`;

const ActionsVideo = (props: IVideoActions) => {
  const onHandleLike = () => {
    if (props.handleLike) {
      props.handleLike();
    }
  };

  const onHandleShare = () => {
    if (props.handleOpenShareDialog) {
      props.handleOpenShareDialog();
    }
  };
  return (
    <SCVideoActionWrapper>
      <SCVideoActionInnerWrapper onClick={onHandleLike}>
        {props.liked ? (
          <SCButton style={{ color: '#fff', background: '#ff2c55' }}>
            <Favorite />
          </SCButton>
        ) : (
          <SCButton>
            <Favorite />
          </SCButton>
        )}

        <SCView>{displayK(props.likes.length)}</SCView>
      </SCVideoActionInnerWrapper>

      <SCVideoActionInnerWrapper>
        <SCButton>
          <Textsms />
        </SCButton>
        <SCView>{props.comments}</SCView>
      </SCVideoActionInnerWrapper>
      <SCVideoActionInnerWrapper onClick={onHandleShare}>
        <SCButton>
          <Share />
        </SCButton>
        <SCView>{props.shares}</SCView>
      </SCVideoActionInnerWrapper>
    </SCVideoActionWrapper>
  );
};

export default ActionsVideo;
