import React, { useMemo } from "react";

const PeerContext = React.createContext(null);
export const usePeerContext = () => React.useContext(PeerContext);

export const WebRtcProvider = (props) => {
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
    await peerConection.setRemoteDescription(answer)
  }

  return (
    <PeerContext.Provider
      value={{ peerConection, createCallOffer, createAnswer,setremoteAnswer }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
