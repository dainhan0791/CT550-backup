import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import useSocket from '../../hooks/useSocket';
const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
  ],
};

const Room = () => {
  useSocket();
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const router = useRouter();
  const userVideoRef = useRef<any>();
  const peerVideoRef = useRef<any>();
  const rtcConnectionRef = useRef<any>(null);
  const socketRef = useRef<any>();
  const userStreamRef = useRef<any>();
  const hostRef = useRef<any>(false);

  const { id: roomName } = router.query;
  useEffect(() => {
    socketRef.current = io();
    // First we join a room
    socketRef.current.emit('join', roomName);

    socketRef.current.on('joined', handleRoomJoined);
    // If the room didn't exist, the server would emit the room was 'created'
    socketRef.current.on('created', handleRoomCreated);
    // Whenever the next person joins, the server emits 'ready'
    socketRef.current.on('ready', initiateCall);

    // Emitted when a peer leaves the room
    socketRef.current.on('leave', onPeerLeave);

    // If the room is full, we show an alert
    socketRef.current.on('full', () => {
      window.location.href = '/';
    });

    // Event called when a remote user initiating the connection and
    socketRef.current.on('offer', handleReceivedOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

    // clear up after
    return () => socketRef.current.disconnect();
  }, [roomName]);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play();
        };
        socketRef.current.emit('ready', roomName);
      })
      .catch((err) => {
        /* handle the error */
        console.log('error', err);
      });
  };

  const handleRoomCreated = () => {
    hostRef.current = true;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play();
        };
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  };

  const initiateCall = () => {
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      rtcConnectionRef.current.addTrack(userStreamRef.current.getTracks()[0], userStreamRef.current);
      rtcConnectionRef.current.addTrack(userStreamRef.current.getTracks()[1], userStreamRef.current);
      rtcConnectionRef.current
        .createOffer()
        .then((offer: any) => {
          rtcConnectionRef.current.setLocalDescription(offer);
          socketRef.current.emit('offer', offer, roomName);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const onPeerLeave = () => {
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true;
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject.getTracks().forEach((track: any) => track.stop()); // Stops receiving all track of Peer.
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  /**
   * Takes a userid which is also the socketid and returns a WebRTC Peer
   *
   * @param  {string} userId Represents who will receive the offer
   * @returns {RTCPeerConnection} peer
   */

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleReceivedOffer = (offer: any) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      rtcConnectionRef.current.addTrack(userStreamRef.current.getTracks()[0], userStreamRef.current);
      rtcConnectionRef.current.addTrack(userStreamRef.current.getTracks()[1], userStreamRef.current);
      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((answer: any) => {
          rtcConnectionRef.current.setLocalDescription(answer);
          socketRef.current.emit('answer', answer, roomName);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const handleAnswer = (answer: any) => {
    rtcConnectionRef.current.setRemoteDescription(answer).catch((err: any) => console.log(err));
  };

  const handleICECandidateEvent = (event: any) => {
    if (event.candidate) {
      socketRef.current.emit('ice-candidate', event.candidate, roomName);
    }
  };

  const handlerNewIceCandidateMsg = (incoming: any) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current.addIceCandidate(candidate).catch((e: any) => console.log(e));
  };

  const handleTrackEvent = (event: any) => {
    // eslint-disable-next-line prefer-destructuring

    peerVideoRef.current.srcObject = event.streams[0];
  };

  const toggleMediaStream = (type: any, state: any) => {
    if (userStreamRef.current.getTracks()) {
      userStreamRef.current.getTracks().forEach((track: any) => {
        if (track.kind === type) {
          // eslint-disable-next-line no-param-reassign
          track.enabled = !state;
        }
      });
    }
  };

  const toggleMic = () => {
    toggleMediaStream('audio', micActive);
    setMicActive((prev) => !prev);
  };

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive((prev) => !prev);
  };

  const leaveRoom = () => {
    socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

    userVideoRef.current.srcObject?.getTracks().forEach((track: any) => track.stop()); // Stops receiving all track of User.
    peerVideoRef.current.srcObject?.getTracks().forEach((track: any) => track.stop()); // Stops receiving audio track of Peer.

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
    router.back();
  };

  return (
    <SCRoomWrap>
      <Grid container>
        <Grid item md={4} textAlign={'start'}>
          <SCPeerVideo autoPlay ref={peerVideoRef} />
        </Grid>
        <Grid item md={7} textAlign={'start'}>
          <SCUserVideo autoPlay ref={userVideoRef} />
        </Grid>
      </Grid>

      <SCHorizal>
        <SCButton onClick={toggleMic} type="button">
          {micActive ? <MicIcon /> : <MicOffIcon />}
        </SCButton>
        <SCButton onClick={toggleCamera} type="button">
          {cameraActive ? <VideocamIcon /> : <VideocamOffIcon />}
        </SCButton>
        <SCButton onClick={leaveRoom} type="button">
          <ArrowBackIcon />
        </SCButton>
      </SCHorizal>
    </SCRoomWrap>
  );
};

const SCRoomWrap = styled.div`
  padding: 2rem;
`;

const SCUserVideo = styled.video`
  border-radius: 8px;
  width: 65%;
  object-fit: cover;
`;
const SCPeerVideo = styled.video`
  border-radius: 8px;
  object-fit: cover;
  width: 65%;
`;

const SCButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  outline: none;
  background-color: #f5f5f5;
  color: black;
  border: 1px solid #f5f5f5;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: black;
    color: white;
  }
`;

const SCHorizal = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

export default Room;
