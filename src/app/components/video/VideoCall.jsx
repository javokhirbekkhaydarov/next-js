"use client";
import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

const VideoCall = ({ peerId, remotePeerId }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [stream, setStream] = useState(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(mediaStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
            }
        };

        getUserMedia();
    }, []);

    useEffect(() => {
        if (peerId && remotePeerId && stream) {
            // Create a peer instance only once when peerId changes
            if (!peerInstance.current) {
                const peer = new Peer(peerId);

                peerInstance.current = peer;

                peer.on("open", () => {
                    console.log("Peer connection established");
                });

                peer.on("call", (call) => {
                    call.answer(stream); // Answer the incoming call with the local stream
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });
                });

                // If there's a remotePeerId, initiate the call to the remote peer
                if (remotePeerId) {
                    const call = peer.call(remotePeerId, stream); // Call the remote peer with the local stream
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });
                }

                return () => {
                    peerInstance.current?.destroy();
                };
            }
        }
    }, [peerId, remotePeerId, stream]);

    return (
        <div className="mt-6">
            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">Local Video</h2>
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full border rounded-lg" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                        {isConnected ? "Remote Video" : "Waiting for connection..."}
                    </h2>
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full border rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
