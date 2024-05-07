import React, { useMemo, useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);
export const usePeerContext = () => React.useContext(PeerContext);

export const WebRtcProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [peersConnected, setPeersConnected] = useState(false);

  const peerConnection = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              // "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createCallOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  };

  const sendStream = async (stream) => {
    if (!stream) {
      console.error('Stream is empty');
      return;
    }
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peerConnection.addTrack(track, stream);
    }
  };

  const handleRemoteEvent = useCallback((event) => {
    const streams = event.streams;
    if (streams.length > 0) {
      setRemoteStream(streams[0]);
    } else {
      console.warn('No remote streams received');
    }
  }, []);

  useEffect(() => {
    peerConnection.addEventListener('track', handleRemoteEvent);
    return () => {
      peerConnection.removeEventListener('track', handleRemoteEvent);
    };
  }, [peerConnection, handleRemoteEvent]);

  useEffect(() => {
    const handleConnectionStateChange = () => {
      console.log("ICE connection state:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "connected") {
        console.log("Peers are connected!");
        setPeersConnected(true);
      } else {
        setPeersConnected(false);
      }
    };

    peerConnection.addEventListener("iceconnectionstatechange", handleConnectionStateChange);

    return () => {
      peerConnection.removeEventListener("iceconnectionstatechange", handleConnectionStateChange);
    };
  }, [peerConnection]);

  return (
    <PeerContext.Provider
      value={{ peerConnection, createCallOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream, peersConnected }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
