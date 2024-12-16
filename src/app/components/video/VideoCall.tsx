"use client";
import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
import { useRouter } from "next/navigation";
import { ShareLink } from "@/app/components/video/ShareLink";
import { RemoteVideo } from "@/app/components/video/RemoteVideo";
import { VideoControls } from "@/app/components/video/VideoControls";

const useMediaStream = (config = { video: true, audio: true }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(config);
        setStream(mediaStream);
      } catch (err) {
        setError(`Error accessing media devices: ${(err as Error).message}`);
      }
    };

    getMediaStream();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [config.video, config.audio]);

  return { stream, error };
};

const usePeerConnection = (
  localStream: MediaStream | null,
  remotePeerId?: string,
) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPeerId, setCurrentPeerId] = useState<string>("");
  const [currentRemotePeerId, setCurrentRemotePeerId] = useState<
    string | undefined
  >(remotePeerId);

  useEffect(() => {
    if (!localStream) return;

    const initPeer = new Peer();

    initPeer.on("open", (id) => {
      setCurrentPeerId(id);
      setPeer(initPeer);

      initPeer.on("call", (call) => {
        call.answer(localStream);
        call.on("stream", (incomingRemoteStream) => {
          setRemoteStream(incomingRemoteStream);
          setCurrentRemotePeerId(call.peer);
        });
      });

      if (remotePeerId) {
        const call = initPeer.call(remotePeerId, localStream);
        call.on("stream", (incomingRemoteStream) => {
          setRemoteStream(incomingRemoteStream);
        });
        call.on("error", (err) => setError(`Call error: ${err.message}`));
      }
    });

    initPeer.on("error", (err) => setError(`Peer error: ${err.message}`));

    return () => {
      initPeer.destroy();
    };
  }, [localStream, remotePeerId]);

  return { peer, remoteStream, error, currentPeerId, currentRemotePeerId };
};

interface VideoCallProps {
  peerId?: string;
  remotePeerId?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ peerId, remotePeerId }) => {
  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { stream: localStream, error: mediaError } = useMediaStream();
  const {
    remoteStream,
    error: peerError,
    currentPeerId,
    currentRemotePeerId,
  } = usePeerConnection(localStream, remotePeerId);

  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicrophoneOn(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  const endCall = () => {
    setIsCallEnded(true);
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
  };

  const handleCopyLink = () => {
    const shareableLink = `${window.location.origin}?peerId=${currentPeerId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const clearPath = () => {
    router.push("/");
    window.location.href = "/";
    setTimeout(() => window.location.reload(), 700);
  };

  if (isCallEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Meeting Finished</h1>
        <div onClick={clearPath} className="cursor-pointer">
          Go Home
        </div>
      </div>
    );
  }

  const errorMessage = mediaError || peerError;
  if (errorMessage) {
    return <div className="text-center text-red-500 mt-4">{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <ShareLink
        peerId={currentPeerId}
        onCopyLink={handleCopyLink}
        linkCopied={linkCopied}
      />

      <div className="flex justify-center items-center flex-col gap-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="object-contain fixed z-0 h-dvh top-0 left-0 right-0 bottom-0 border border-gray-300 rounded m-auto"
        />
        <RemoteVideo videoRef={remoteVideoRef} />
      </div>
      <VideoControls
        isVideoOn={isVideoOn}
        isMicrophoneOn={isMicrophoneOn}
        onToggleVideo={toggleVideo}
        onToggleMicrophone={toggleMicrophone}
        onEndCall={endCall}
      />
      {errorMessage && (
        <div className="text-center text-red-500 mt-4">{errorMessage}</div>
      )}
    </div>
  );
};

export default VideoCall;
