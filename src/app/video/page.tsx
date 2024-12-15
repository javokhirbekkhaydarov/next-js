"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoCall from "../components/video/VideoCall";
import Peer from "peerjs";

const VideoPage = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Get the query parameter from the window's URL
    const urlParams = new URLSearchParams(window.location.search);
    const queryPeerId = urlParams.get("peerId");

    if (queryPeerId) {
      setRemotePeerId(queryPeerId);
      setIsMeetingStarted(true);
    }
  }, []);

  const createMeeting = () => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      setIsMeetingStarted(true);

      // Update URL without full page reload
      const newUrl = `/?peerId=${id}`;
      router.push(newUrl);
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

      {isMeetingStarted && (
        <VideoCall peerId={peerId} remotePeerId={remotePeerId} />
      )}
    </div>
  );
};

export default VideoPage;
