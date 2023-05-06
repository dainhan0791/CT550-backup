import React from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks/hooks';
import Layout from '../../components/shared/Layout';
import { Container } from '@mui/material';

const CallPage = () => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.account.profile);
  const { roomId } = router.query;

  const appId = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
  const secret = process.env.NEXT_PUBLIC_ZEGO_SECRET;

  const myMeeting = async (element: any) => {
    if (roomId && profile && appId && secret) {
      const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

      if (ZegoUIKitPrebuilt) {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appId),
          secret,
          roomId.toString(),
          profile?.uid,
          profile?.name,
        );
        const zp: any = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Coppy Link',
              url: `${process.env.NEXT_PUBLIC_APPLICATION_URL}/call/${roomId.toString()}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: true,
        });
      }
    }
  };

  return (
    <Layout title="Call Video">
      <Container maxWidth="xl" disableGutters style={{ marginTop: '70px' }}>
        {myMeeting && (
          <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: '100%', height: '88vh', margin: '0 auto' }}
          ></div>
        )}
      </Container>
    </Layout>
  );
};

export default CallPage;
