import React from 'react';
import AccountChatItem from '../items/AccountChatItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { ITime } from '../../interfaces/time.interface';
import { IMemberItem } from '../../interfaces/chat.interface';
import { IAccountItem } from '../../interfaces/account.interface';
import { setTargetConversation } from '../../redux/slices/chat.slice';

const MembersWrap = (props: IMemberItem) => {
  const accounts = useAppSelector((state) => state.account.accounts);

  const dispatch = useAppDispatch();
  // const targetAccount = useAppSelector((state) => state.chat.acountTarget);

  const account = accounts.find((account) => account.uid === props.uid);

  // React.useEffect(() => {
  //   if (!targetAccount && props.targetIndex === 0 && account && props.cid) {
  //     dispatch(
  //       setTargetConversation({
  //         acountTarget: account,
  //         cid: props.cid,
  //       }),
  //     );
  //   }
  // }, [props, targetAccount]);

  return (
    <div id="members-wrap">
      {account && props.timestamp && (
        <AccountChatItem
          uid={account.uid}
          name={account.name}
          nickname={account.nickname}
          email={account.email}
          photoURL={account.photoURL}
          tick={account.tick}
          timestamp={props.timestamp}
          conversationId={props.cid}
          followers={[]}
        />
      )}
    </div>
  );
};

export default MembersWrap;
