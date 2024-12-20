"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoCall from "../components/video/VideoCall";
import Peer from "peerjs";

const VideoPageContent: React.FC = () => {
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryPeerId = searchParams.get("peerId");

    if (queryPeerId) {
      setRemotePeerId(queryPeerId);
      setIsMeetingStarted(true);
    }
  }, [searchParams]);

  const createMeeting = () => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      setIsMeetingStarted(true);

      const newUrl = `/?peerId=${id}`;
      router.push(newUrl);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });
  };

  return (
    <div
      className="flex flex-col items-center gap-4 justify-center min-h-screen"
      style={{ padding: "20px" }}
    >
      {!isMeetingStarted && (
        <>
          <h1 className="text-3xl text-uppercase font-bold">Video Call</h1>
          <button
            onClick={createMeeting}
            className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            New Meeting +
          </button>
        </>
      )}

      {isMeetingStarted && (
        <VideoCall peerId={peerId} remotePeerId={remotePeerId} />
      )}
    </div>
  );
};

const VideoPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageContent />
    </Suspense>
  );
};

export default VideoPage;
