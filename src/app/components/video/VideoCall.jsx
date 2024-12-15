"use client";

import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

const VideoCall = ({ peerId, remotePeerId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerInstance = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentPeerId, setCurrentPeerId] = useState(peerId);
  const [currentRemotePeerId, setCurrentRemotePeerId] = useState(remotePeerId);

  useEffect(() => {
    const initializeMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;

        const peer = new Peer();

        peer.on("open", (id) => {
          setCurrentPeerId(id);

          peer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteStreamRef.current = remoteStream;
              setCurrentRemotePeerId(call.peer);
            });
          });

          if (remotePeerId) {
            const call = peer.call(remotePeerId, stream);
            call.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteStreamRef.current = remoteStream;
              setCurrentRemotePeerId(remotePeerId);
            });

            call.on("error", (err) => {
              setErrorMessage(`Call error: ${err.message}`);
            });
          }
        });

        peer.on("error", (err) => {
          setErrorMessage(`PeerJS error: ${err.message}`);
        });

        peerInstance.current = peer;
      } catch (err) {
        setErrorMessage(`Error accessing media devices: ${err.message}`);
      }
    };

    initializeMediaStream();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, [remotePeerId]);

  const shareableLink = `${window.location.origin}?peerId=${currentPeerId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
      <div className={'flex flex-col items-center justify-center'}>
        <div>
          <p>Share this link with others to join:</p>
          <div className="flex items-center gap-2">
            <input
                type="text"
                value={linkCopied ? "Link copied!" : shareableLink}
                readOnly
                className="border px-2 py-1 rounded flex-1"
            />
            <button
                onClick={handleCopyLink}
                className="px-4 py-1 bg-blue-500 text-white rounded"
            >
              {linkCopied ? "Copied✅" : "Copy Link"}
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center  flex-col gap-4 mt-4">
          <div className="text-center">
            <h3>My Video (ID: {currentPeerId})</h3>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-[300px] h-[225px] border border-gray-300 rounded m-auto"
            />
          </div>

          <div className="text-center ">
            <h3>
              {currentRemotePeerId
                  ? `Remote Video (ID: ${currentRemotePeerId})`
                  : "Waiting for remote connection..."}
            </h3>
            <video
                ref={remoteVideoRef}
                autoPlay
                className="w-[300px] h-[225px] m-auto border border-gray-300 rounded"
            />
          </div>
        </div>

        {errorMessage && (
            <div className="text-center text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
  );
};

export default VideoCall;
