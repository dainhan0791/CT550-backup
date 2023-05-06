// import React from 'react';
// import styled from 'styled-components';
// import { IMessage } from '../../interfaces/chat.interface';
// import { useAppSelector } from '../../redux/hooks/hooks';
// import Grid2 from '@mui/material/Unstable_Grid2';
// import { Avatar } from '@mui/material';

// const SCBoxMessages = styled.div`
//   height: 100%;
//   overflow: hidden scroll;
// `;

// const SCMessagesWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   display: block;
//   line-height: 1.2rem;
//   word-wrap: break-word;
//   letter-spacing: 0.03rem;
//   width: fit-content;
//   max-width: 80%;
//   text-align: start;
// `;

// const SCMessagesCurrentAccountChatWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: end;
//   text-align: end;
//   display: block;
//   line-height: 1.2rem;
//   word-wrap: break-word;
//   letter-spacing: 0.03rem;
//   width: fit-content;
//   margin-left: auto;
//   max-width: 80%;
// `;
// const SCMessage = styled.p`
//   background-color: #f6f9fa;
//   padding: 0.3rem 0.6rem;
//   border-radius: 6px;
// `;

// const SCMessageCurrentAccountChat = styled.p`
//   background-color: rgb(0, 132, 255, 0.7);
//   color: #fff;
//   padding: 0.3rem 0.6rem;
//   border-radius: 6px;
// `;

// const BoxMessages = ({ messages }: { messages: Array<IMessage> }) => {
//   const profile = useAppSelector((state) => state.account.profile);
//   const accountTarget = useAppSelector((state) => state.chat.acountTarget);
//   const conversationIdTarget = useAppSelector((state) => state.chat.cid);

//   return (
//     <>
//       {accountTarget &&
//       conversationIdTarget &&
//       accountTarget.conversationId === conversationIdTarget &&
//       profile &&
//       messages.length ? (
//         <SCBoxMessages>
//           {messages.map((message: IMessage, index: number) => (
//             <Grid2 container display={'flex'} alignItems={'end'} key={index} padding={'0rem 0.5rem'}>
//               <>
//                 {message.senderId !== profile.uid ? (
//                   <>
//                     <Grid2 md={0.6}>
//                       <Avatar src={accountTarget.photoURL} alt={'accountChat'} sx={{ width: 26, height: 26 }} />
//                     </Grid2>
//                     <Grid2 md={11.4} display={'flex'} flexDirection={'column'} className="messages">
//                       <SCMessagesWrap>
//                         <SCMessage>{message?.text}</SCMessage>
//                       </SCMessagesWrap>
//                     </Grid2>
//                   </>
//                 ) : (
//                   <Grid2 md={12} display={'flex'} flexDirection={'column'} className="messages">
//                     <SCMessagesCurrentAccountChatWrap>
//                       <SCMessageCurrentAccountChat>{message?.text}</SCMessageCurrentAccountChat>
//                     </SCMessagesCurrentAccountChatWrap>
//                   </Grid2>
//                 )}
//               </>
//             </Grid2>
//           ))}
//         </SCBoxMessages>
//       ) : (
//         <SCBoxMessages></SCBoxMessages>
//       )}
//     </>
//   );
// };

// export default BoxMessages;

import React from 'react';

const BoxMessages = () => {
  return <div>BoxMessages</div>;
};

export default BoxMessages;
