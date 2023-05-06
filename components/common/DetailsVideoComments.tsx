import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import InputEmoji from 'react-input-emoji';
import { useSnackbar } from 'notistack';
import { IComment, ICommentProps } from '../../interfaces/comment.interface';
import AccountCommentItem from '../items/AccountCommentItem';
import { useAppSelector } from '../../redux/hooks/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from '@mui/material';

const SCDetailsVideoComments = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  height: 54%;
`;

const SCBoxComments = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: rgb(248, 248, 248);
  border-top: 1px solid rgba(22, 24, 35, 0.2);
  border-bottom: 1px solid rgba(22, 24, 35, 0.2);
  -webkit-box-flex: 1;
  flex-grow: 1;
  position: relative;
  overflow-x: hidden;
`;

const SCInput = styled(InputEmoji)``;

const DetailsVideoComments = ({
  handleComment,
  comments,
  totalComments,
  limitComments,
  setLimitComments,
}: {
  handleComment: Function;
  comments: Array<IComment>;
  totalComments: number;
  limitComments: number;
  setLimitComments: Function;
}) => {
  const profile = useAppSelector((state) => state.account.profile);
  const { enqueueSnackbar } = useSnackbar();
  const [text, setText] = React.useState<string>('');

  function handleOnEnter(text: string) {
    if (handleComment && text) {
      handleComment(text);
    } else {
      enqueueSnackbar('Please enter a comment', {
        variant: 'default',
      });
    }
  }

  const moreCommentsData = () => {
    if (setLimitComments && limitComments) {
      setTimeout(() => {
        setLimitComments((limitComments: number) => limitComments + 5);
      }, 500);
    }
  };

  return (
    <SCDetailsVideoComments>
      <SCBoxComments id="box-comments">
        {comments.length && profile ? (
          <InfiniteScroll
            next={moreCommentsData}
            dataLength={comments.length}
            hasMore={limitComments <= totalComments}
            loader={<Skeleton height={200} style={{ transform: 'none' }} variant="rectangular" />}
            endMessage={''}
            height={300}
            scrollableTarget="box-comments"
          >
            {comments.map((comment) => (
              <AccountCommentItem
                key={comment.cid}
                cid={comment.cid}
                vid={comment.vid}
                uid={comment.uid}
                text={comment.text}
                timestamp={comment.timestamp}
                likes={comment.likes}
                childrens={comment.childrens}
                creator={comment.creator}
                liked={comment.likes.includes(profile.uid)}
              />
            ))}
          </InfiniteScroll>
        ) : (
          ''
        )}
      </SCBoxComments>
      <SCInput value={text} onChange={setText} cleanOnEnter onEnter={handleOnEnter} placeholder="message..." />
    </SCDetailsVideoComments>
  );
};

export default DetailsVideoComments;
