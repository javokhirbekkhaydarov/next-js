"use client";
import React, { useState, useEffect } from "react";
import VideoCall from "../components/video/VideoCall";
import Peer from "peerjs";

const VideoPage = () => {
  const [peerId, setPeerId] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    // Havoladan peerId ni olish
    const params = new URLSearchParams(window.location.search);
    const peerIdFromLink = params.get("peerId");
    if (peerIdFromLink) {
      setRemotePeerId(peerIdFromLink);
      setIsMeetingStarted(true);
    }
  }, []);

  const createMeeting = () => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
      setShareableLink(`${window.location.origin}?peerId=${id}`);
      setIsMeetingStarted(true);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true);

      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
    <div
      style={{ padding: "20px", position: "absolute", top: "20px" }}
      className="flex items-center justify-center flex-col"
    >
      <h1>Video Call</h1>

      {!isMeetingStarted ? (
        <button
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={createMeeting}
        >
          New meeting +
        </button>
      ) : (
        <div>
          {peerId && (
            <div>
              <p>Share this link with others to join:</p>
              <input
                type="text"
                value={linkCopied ? "Link copied!" : shareableLink}
                readOnly
                className="border px-2 py-1 rounded"
              />
              <button onClick={handleCopyLink} className="ml-2 btn">
                {!linkCopied ? "Copy Link" : "Copied✅"}
              </button>
            </div>
          )}
          {remotePeerId && <p>Connecting to: {remotePeerId}</p>}
        </div>
      )}

      {isMeetingStarted && (
        <VideoCall peerId={peerId} remotePeerId={remotePeerId} />
      )}
    </div>
  );
};

export default VideoPage;
