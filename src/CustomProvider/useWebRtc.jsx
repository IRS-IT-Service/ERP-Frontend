import React, { useMemo,useEffect,useState, useCallback } from "react";

const PeerContext = React.createContext(null);
export const usePeerContext = () => React.useContext(PeerContext);

export const WebRtcProvider = (props) => {
  const [remoteStream,setRemoteStream] = useState(null)
  const peerConection = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );
  const createCallOffer = async () => {
    const offer = await peerConection.createOffer();
    await peerConection.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peerConection.setRemoteDescription(offer);
    const answer = await peerConection.createAnswer();
    await peerConection.setLocalDescription(answer);
    return answer;
  };

  const setremoteAnswer = async (answer) => {
    console.log(answer)
    await peerConection.setRemoteDescription(answer);
  };

  const sendStream = async (stream) => {
    console.log('Sending stream:', stream);
    if (!stream) {
      console.error('Stream is empty');
      return;
    }
    const tracks = stream.getTracks();
    console.log('Tracks:', tracks);
    for (const track of tracks) {
      console.log('Adding audio track:', track);
      peerConection.addTrack(track, stream);
    }
  };
  
  const handleRemoteEvent = useCallback((event) => {
    console.log('Track event received:', event);
    const streams = event.streams;
    console.log('Remote streams:', streams);
    if (streams.length > 0) {
      setRemoteStream(streams[0]);
    } else {
      console.warn('No remote streams received');
    }
  }, []);
  

  
  
  useEffect(() => {
    console.log("Adding track event listener...");
    peerConection.addEventListener('track', handleRemoteEvent);
    return () => {
      console.log("Removing track event listener...");
      peerConection.removeEventListener('track', handleRemoteEvent);
    };
  }, [peerConection, handleRemoteEvent]);
  

  useEffect(() => {
    if (peerConection) {
      const handleConnectionStateChange = () => {
        console.log("ICE connection state:", peerConection.iceConnectionState);
        // Check if the ICE connection state is connected
        if (peerConection.iceConnectionState === "connected") {
          console.log("Peers are connected!");
        }
      };
  
      peerConection.addEventListener("iceconnectionstatechange", handleConnectionStateChange);
  
      return () => {
        peerConection.removeEventListener("iceconnectionstatechange", handleConnectionStateChange);
      };
    }
  }, [peerConection]);
  
  
  return (
    <PeerContext.Provider
      value={{ peerConection, createCallOffer, createAnswer, setremoteAnswer ,sendStream,remoteStream}}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
