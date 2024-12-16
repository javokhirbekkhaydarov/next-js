"use client";

import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
import VideoIcon from "@/app/components/icons/VideoIcon";
import VideoOffIcon from "@/app/components/icons/VideoOffIcon";
import Microphone from "@/app/components/icons/Microphone";
import { MicrophoneOff } from "@/app/components/icons/MicrophoneOff";
import { EndCall } from "@/app/components/icons/EndCall";
import {useRouter} from "next/navigation";

const VideoCall = ({ peerId, remotePeerId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerInstance = useRef(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentPeerId, setCurrentPeerId] = useState(peerId);
  const [currentRemotePeerId, setCurrentRemotePeerId] = useState(remotePeerId);

  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallEnded, setIsCallEnded] = useState(false);

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
          setErrorMessage(`Error: ${err.message}`);
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

  const toggleMicrophone = () => {
    const audioTrack = localStreamRef.current
        ?.getTracks()
        .find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicrophoneOn(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current
        ?.getTracks()
        .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  const endCall = () => {
    setIsCallEnded(true);

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

  const shareableLink = `${window.location.origin}?peerId=${currentPeerId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };
  const clearPath = () => {
    router.push("/");
    window.location.href = '/'
    setTimeout(() => {
      window.location.reload()
    } , 700)

  };
  if (isCallEnded) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-bold">Meeting Finished</h1>
          <div onClick={() => clearPath()} className={'cursor-pointer'}>Go Home</div>
        </div>
    );
  }

  return (
      <div className="flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4 z-10 h-auto join-card md:top-auto md:bottom-4 share_card">
          <p>Share this link with others to join:</p>
          <div className="flex flex-col items-center gap-2">
            <input
                type="text"
                value={linkCopied ? "Link copied!" : peerId}
                readOnly
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            />
            <button
                onClick={handleCopyLink}
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {linkCopied ? "Copied✅" : "Copy Link"}
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <video
              ref={localVideoRef}
              autoPlay
              muted
              className="object-contain fixed z-0 h-dvh top-0 left-0 right-0 bottom-0 border border-gray-300 rounded m-auto"
          />
          <video
              ref={remoteVideoRef}
              autoPlay
              className="h-auto remote_video w-[300px] object-cover join-card object-contain fixed z-10 right-4 bottom-4 bg-slate-300 m-auto border border-gray-300 rounded"
          />
        </div>
        <div className="actions fixed bottom-4 flex gap-4">
          <div className="icons">

          <button onClick={toggleVideo} className="video">
            {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
          </button>
          <button
              onClick={toggleMicrophone}
              className="video"
          >
            {isMicrophoneOn ? <Microphone /> : <MicrophoneOff />}
          </button>
          <button onClick={endCall} className="video end_call">
            <EndCall />
          </button>
          </div>
        </div>
        {errorMessage && (
            <div className="text-center text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
  );
};

export default VideoCall;
