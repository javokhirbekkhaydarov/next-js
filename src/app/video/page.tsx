"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoCall from "../components/video/VideoCall";
import Peer from "peerjs";

const VideoPage = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

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

      // Update URL without reloading the page
      router.push(`/?peerId=${id}`);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });
  };

  return (
      <div
          className="flex flex-col items-center justify-center"
          style={{ padding: "20px", position: "absolute", top: "20px" }}
      >
        <h1>Video Call</h1>

        {!isMeetingStarted && (
            <button
                onClick={createMeeting}
                className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
            >
              New Meeting +
            </button>
        )}

        {isMeetingStarted && <VideoCall peerId={peerId} remotePeerId={remotePeerId} />}
      </div>
  );
};

export default VideoPage;
