import React from 'react';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';

// local
import { IVideo, IVideoDetailsItem } from '../../../interfaces/video.interface';

// firebase
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { fStore } from '../../../firebase/init.firebase';
import { useAppSelector } from '../../../redux/hooks/hooks';
import { IAccountItem } from '../../../interfaces/account.interface';
import DetailsVideo from '../../../components/common/DetailsVideo';
import Layout from '../../../components/shared/Layout';
import AccountDetailsVideoItem from '../../../components/items/AccountDetailsVideoItem';
import { useSnackbar } from 'notistack';
import VideoActions from '../../../components/common/ActionsVideo';
import DetailsRight from '../../../components/common/DetailsRight';
import { IComment } from '../../../interfaces/comment.interface';

const SCWrapper = styled.div`
  overflow-y: hidden;
  height: 100vh;
`;
const SCVideoWrapper = styled(Grid)`
  display: flex;
  background: #191d1e; /* Old browsers */
  background: -moz-linear-gradient(0deg, #191d1e 50%, #283139 100%); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(50%, #191d1e),
    color-stop(100%, #283139)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(0deg, #191d1e 50%, #283139 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(0deg, #191d1e 50%, #283139 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(0deg, #191d1e 50%, #283139 100%); /* IE10+ */
  background: linear-gradient(0deg, #191d1e 50%, #283139 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#191d1e', endColorstr='#283139',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
  background-attachment: fixed;
`;

const DetailVideo = () => {
  const profile = useAppSelector((state) => state.account.profile);
  const feeds = useAppSelector((state) => state.feeds.videos);

  const router = useRouter();
  const { user, videoId } = router.query;
  const [video, setVideo] = React.useState<IVideoDetailsItem>();

  const [comments, setComments] = React.useState<Array<IComment>>([]);
  const [limitComments, setLimitComments] = React.useState<number>(5);
  const [totalComments, setTotalComments] = React.useState<number>(0);

  const [profileVideo, setProfileVideo] = React.useState<IAccountItem>();

  React.useEffect(() => {
    const getDetailVideo = async () => {
      if (!videoId) {
        return;
      }
      try {
        if (fStore && videoId) {
          const videoRef = doc(fStore, 'videos', videoId.toString());

          const videoSnap = await getDoc(videoRef);

          if (videoSnap.exists()) {
            const userRef = doc(fStore, 'users', videoSnap.data().uid);
            const userSnap = await getDoc(userRef);

            if (videoSnap.exists() && userSnap.exists()) {
              setVideo(videoSnap.data() as IVideoDetailsItem);
              setProfileVideo(userSnap.data() as IAccountItem);
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetailVideo();
  }, [videoId, feeds]);

  const sortComments = (data: Array<IComment>) => {
    if (Array.isArray(data)) {
      return data.sort((a: IComment, b: IComment) => b.likes.length - a.likes.length);
    }
  };

  React.useEffect(() => {
    const getComment = async () => {
      try {
        const q = query(collection(fStore, 'comments'), where('vid', '==', videoId), limit(limitComments));
        onSnapshot(q, (querySnapshot) => {
          const data: Array<IComment> = [];
          querySnapshot.forEach((doc) => {
            data.push(doc.data() as IComment);
          });

          if (Array.isArray(data)) {
            setTotalComments(data.length as number);
            sortComments(data as Array<IComment>);
            setComments(data as Array<IComment>);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getComment();
  }, [videoId, limitComments]);

  React.useEffect(() => {
    router.prefetch('/foryou');
  }, []);

  return (
    <Layout title="Tik tok" details>
      <SCWrapper>
        <Grid container>
          <SCVideoWrapper item md={7}>
            {video && (
              <DetailsVideo
                url={video?.url}
                hashtag={video?.hashtag}
                likes={video?.likes}
                shares={video?.shares}
                liked={video?.likes.includes(profile?.uid as string)}
                vid={video.vid}
                views={video.views}
                uid={video.uid}
                comments={video.comments}
              />
            )}
          </SCVideoWrapper>
          <Grid item md={5}>
            {video && profileVideo && (
              <DetailsRight
                profileVideo={profileVideo}
                video={video}
                comments={comments}
                totalComments={totalComments}
                limitComments={limitComments}
                setLimitComments={setLimitComments}
              />
            )}
          </Grid>
        </Grid>
      </SCWrapper>
    </Layout>
  );
};

export default DetailVideo;
