import React from 'react';
import styled from 'styled-components';

import useElementOnScreen from '../../hooks/useElementOnScreen';
import { IVideo } from '../../interfaces/video.interface';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { fStore } from '../../firebase/init.firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { ClearRounded, PlayArrowRounded, VolumeUpRounded, VolumeOffRounded } from '@mui/icons-material';
import { Slider } from '@mui/material';
import Link from 'next/link';

const SCVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const SCVideo = styled.video`
  display: block;
  width: 100%;
  height: 100vh;
  object-fit: contain;
`;

const SCBackButton = styled.button`
  position: absolute;
  z-index: 1;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(84, 84, 84, 0.5);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  outline: none;
  top: 20px;
  left: 20px;
  transition: opacity 0.3s ease 0s;
`;

const SCVolumeWrapper = styled.div`
  &:hover {
    > button:nth-child(1) {
      display: block;
    }
  }
`;

const SCSliderButton = styled.button`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 1;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 1.9rem;
  height: 6rem;
  padding: 0.8rem 0;
  background: rgba(84, 84, 84, 0.5);
  color: #fff;
  border-radius: 0.8rem;
  cursor: pointer;
  border: none;
  outline: none;
  right: 25px;
  bottom: 120px;
  transition: opacity 0.3s ease 0s;
  display: none;
  &:after {
    content: 'slider';
    background: transparent;
    color: transparent;
  }
`;
const SCVolumeButton = styled.button`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 1;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(84, 84, 84, 0.5);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  outline: none;
  right: 20px;
  bottom: 70px;
  transition: opacity 0.3s ease 0s;
`;
const SCPlayArrowButton = styled(PlayArrowRounded)`
  position: absolute;
  z-index: 1;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 5rem !important;
  height: 5rem !important;
  color: #fff;
  cursor: pointer;
  border: none;
  outline: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease 0s;
`;

const DetailsVideo = (props: IVideo) => {
  const router = useRouter();

  const videoRef = React.useRef<any>();

  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.account.profile);

  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState<number>(100);

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
  };
  const isVisibile = useElementOnScreen(options, videoRef);

  const autoPlayVideo = async () => {
    if (isVisibile) {
      if (!playing && props && fStore) {
        const docRef = doc(fStore, 'videos', props.vid);
        if (docRef && profile) {
          if (!props.views.includes(profile.uid)) {
            await updateDoc(docRef, {
              views: arrayUnion(profile.uid),
            });
          }
        }
        videoRef.current.play();
        setPlaying(true);
      }
    } else {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  React.useEffect(() => {
    autoPlayVideo();
  }, [isVisibile]);

  const handleVideo = () => {
    if (playing && videoRef) {
      videoRef.current.pause();

      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleBack = () => {
    if (!props) return;

    router.back();
  };

  const handleChangeVolume = (event: any) => {
    setVolume(event?.target.value);
    const video: any = document.getElementById('video');
    if (video) {
      video.volume = event?.target.value / 100;
    }
  };
  const handleMuted = () => {
    const video: any = document.getElementById('video');
    if (video) {
      video.volume = 0;
      setVolume(0);
    }
  };

  // const ta: any = document.getElementById('video');

  // ta.volume = 0;
  return (
    <SCVideoWrapper>
      {props.url && <SCVideo id="video" onClick={handleVideo} ref={videoRef} src={props.url} loop preload="true" />}
      <SCBackButton onClick={handleBack}>
        <ClearRounded />
      </SCBackButton>

      {!playing && <SCPlayArrowButton onClick={handleVideo} />}
      <SCVolumeWrapper>
        <SCSliderButton>
          <Slider
            value={volume}
            onChange={handleChangeVolume}
            aria-label="Volume"
            min={0}
            max={100}
            valueLabelDisplay="auto"
            orientation="vertical"
            sx={{
              color: '#fff',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                backgroundColor: '#fff',
                '&:before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
        </SCSliderButton>

        <SCVolumeButton>
          {volume !== 0 ? <VolumeUpRounded onClick={handleMuted} /> : <VolumeOffRounded />}
        </SCVolumeButton>
      </SCVolumeWrapper>
    </SCVideoWrapper>
  );
};

export default DetailsVideo;
