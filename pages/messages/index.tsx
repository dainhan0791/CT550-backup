import React from 'react';
import Layout from '../../components/shared/Layout';

// Mui
import { Avatar, Container, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';

import { IChatSlice, IConversation, IMemberItem, IMessage } from '../../interfaces/chat.interface';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { fStore } from '../../firebase/init.firebase';
import AccountChatItem from '../../components/items/AccountChatItem';
import MembersWrap from '../../components/common/MembersWrap';
import { IAccountItem } from '../../interfaces/account.interface';
import AccountItem from '../../components/items/AccountItem';
import AccountTargetItem from '../../components/items/AccountTargetItem';
// @ts-ignore
import InputEmoji from 'react-input-emoji';
import { timeStamp } from 'console';
import moment from 'moment';
import { setTargetConversation } from '../../redux/slices/chat.slice';
import BoxMessages from '../../components/common/BoxMessages';

const SCArrowBackIconWrap = styled.button`
  z-index: 1;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 2.3rem;
  height: 2.3rem;
  background-color: rgba(22, 24, 35, 0.03);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  outline: none;
  transition: opacity 0.3s ease 0s;
`;

const SCBoxWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 8px;
  border-radius: 8px;
`;
const SCConversationWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 8px;
  border-radius: 8px;
`;

const SCHeadTitle = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 0px 16px 0px 24px;
  box-sizing: border-box;
  -webkit-box-flex: 0;
  flex-grow: 0;
  flex-shrink: 0;
`;

const SCBoxMessages = styled.div`
  height: 100%;
  overflow: hidden scroll;
`;

const SCMessagesWrap = styled.div`
  display: flex;
  flex-direction: column;
  display: block;
  line-height: 1.2rem;
  word-wrap: break-word;
  letter-spacing: 0.03rem;
  width: fit-content;
  max-width: 80%;
  text-align: start;
`;

const SCMessagesCurrentAccountChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  text-align: end;
  display: block;
  line-height: 1.2rem;
  word-wrap: break-word;
  letter-spacing: 0.03rem;
  width: fit-content;
  margin-left: auto;
  max-width: 80%;
`;
const SCMessage = styled.p`
  background-color: #f6f9fa;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
`;

const SCMessageCurrentAccountChat = styled.p`
  background-color: rgb(0, 132, 255, 0.7);
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
`;

const Messages = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const messageEl = React.useRef<HTMLDivElement>(null);

  const profile = useAppSelector((state) => state.account.profile);
  const accountTarget = useAppSelector((state) => state.chat.acountTarget);
  const conversationIdTarget = useAppSelector((state) => state.chat.cid);

  const [conversations, setConversations] = React.useState<Array<IConversation>>([]);

  // Accounts Chat
  const [members, setMembers] = React.useState<Array<IMemberItem>>([]);

  // Messages Chat
  const [messages, setMessages] = React.useState<Array<IMessage>>([]);

  const [text, setText] = React.useState<string>('');

  const goToHomePage = () => {
    router.back();
  };

  const handleOnEnter = async (text: string) => {
    if (text && fStore && conversationIdTarget && profile) {
      try {
        const conversationRef = doc(fStore, 'conversations', conversationIdTarget);

        await updateDoc(conversationRef, {
          messages: arrayUnion({
            senderId: profile.uid,
            text: text,
            timestamp: Date.now(),
          }),
          totalMessages: increment(1),
        });

        // const messagesElement = document.querySelectorAll('.messages');
        // if (messagesElement) {
        //   messagesElement[messagesElement.length - 1].scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'end',
        //     inline: 'nearest',
        //   });
        // }
      } catch (error) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    const getConversations = async () => {
      try {
        if (profile) {
          const q = query(collection(fStore, 'conversations'), where('members', 'array-contains', profile.uid));

          onSnapshot(q, (querySnapshot) => {
            const data: Array<IConversation> = [];
            querySnapshot.forEach((doc) => {
              data.push(doc.data() as IConversation);
            });

            let members: Array<IMemberItem> = [];
            // let messages: Array<IMessage> = [];
            let messages: Array<IMessage> = [];

            data.forEach((conversation: IConversation) => {
              conversation.members.forEach((member: string) => {
                if (member !== profile.uid) {
                  const item: IMemberItem = {
                    uid: member,
                    timestamp: conversation.timestamp,
                    cid: conversation.cid,
                  };
                  members.push(item);
                }
              });

              if (conversationIdTarget) {
                if (conversation.cid === conversationIdTarget) {
                  messages = messages.concat(conversation.messages);
                }
              }
            });

            setMembers(members);

            setMessages(messages);

            setConversations(data);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [profile, conversationIdTarget, accountTarget]);

  React.useEffect(() => {
    if (messageEl) {
      // messageEl?.current.addEventListener('DOMNodeInserted', (event) => {
      //   const { currentTarget: target } = event;
      //   target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      // });

      messageEl.current?.addEventListener('DOMNodeInserted', (event: any) => {
        if (event) {
          const { currentTarget: target } = event;
          if (target) {
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          }
        }
      });
    }
  }, [router, accountTarget]);

  return (
    <Layout title={'Messages'}>
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid2 container spacing={1}>
          <Grid2 md={0.5}>
            <SCArrowBackIconWrap onClick={goToHomePage}>
              <ArrowBackIcon />
            </SCArrowBackIconWrap>
          </Grid2>

          <Grid2 md={11.5}>
            <Grid2 container spacing={2}>
              <Grid2 md={4}>
                <SCConversationWrap>
                  <SCHeadTitle>
                    <h1>Messages</h1>
                  </SCHeadTitle>
                  {members.map((member: IMemberItem, index: number) => (
                    <MembersWrap
                      key={index}
                      uid={member.uid}
                      timestamp={member.timestamp}
                      targetIndex={index}
                      cid={member.cid}
                    />
                  ))}
                </SCConversationWrap>
              </Grid2>

              <Grid2 md={8}>
                <SCBoxWrap>
                  {accountTarget && (
                    <AccountTargetItem
                      uid={accountTarget.uid}
                      name={accountTarget.name}
                      nickname={accountTarget.nickname}
                      email={accountTarget.email}
                      photoURL={accountTarget.photoURL}
                      tick={accountTarget.tick}
                      followers={accountTarget.followers}
                    />
                  )}
                  {/* {messages.length && <BoxMessages messages={messages} />} */}
                  {accountTarget && messages.length ? (
                    <SCBoxMessages ref={messageEl}>
                      {profile &&
                        messages.map((message: IMessage, index: number) => (
                          <Grid2 container display={'flex'} alignItems={'end'} key={index} padding={'0rem 0.5rem'}>
                            <>
                              {message.senderId !== profile.uid ? (
                                <>
                                  <Grid2 md={0.6}>
                                    <Avatar src={accountTarget.photoURL} sx={{ width: 26, height: 26 }} />
                                  </Grid2>
                                  <Grid2 md={11.4} display={'flex'} flexDirection={'column'} className="messages">
                                    <SCMessagesWrap>
                                      <SCMessage>{message?.text}</SCMessage>
                                    </SCMessagesWrap>
                                  </Grid2>
                                </>
                              ) : (
                                <Grid2 md={12} display={'flex'} flexDirection={'column'} className="messages">
                                  <SCMessagesCurrentAccountChatWrap>
                                    <SCMessageCurrentAccountChat>{message?.text}</SCMessageCurrentAccountChat>
                                  </SCMessagesCurrentAccountChatWrap>
                                </Grid2>
                              )}
                            </>
                          </Grid2>
                        ))}
                    </SCBoxMessages>
                  ) : (
                    <SCBoxMessages></SCBoxMessages>
                  )}

                  <InputEmoji
                    value={text}
                    onChange={setText}
                    cleanOnEnter
                    onEnter={handleOnEnter}
                    placeholder="message..."
                  />
                </SCBoxWrap>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Layout>
  );
};

export default Messages;
