import React, { useMemo } from "react";

const PeerContext = React.createContext(null);
export const usePeerContext = () => React.useContext(PeerContext)

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
  const createCallOffer = async() => {
    const offer = await peerConection.createOffer()
    await peerConection.setLocalDescription(offer)
    return offer
  }

  return (
    <PeerContext.Provider value={{peerConection}}>{props.children}</PeerContext.Provider>
  );
};

