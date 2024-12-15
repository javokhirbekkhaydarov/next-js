"use client";
import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

interface VideoCallProps {
    peerId: string;
    remotePeerId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ peerId, remotePeerId }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerInstance = useRef<Peer | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let currentPeer: Peer;

        const initializePeer = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                currentPeer = new Peer(peerId);
                peerInstance.current = currentPeer;

                currentPeer.on("open", () => {
                    console.log("Peer connection established");
                });

                currentPeer.on("call", (call) => {
                    console.log("Incoming call...");
                    call.answer(stream);
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });
                });

                // If remotePeerId is provided, make the outgoing call
                if (remotePeerId) {
                    console.log("Making call to:", remotePeerId);
                    const call = currentPeer.call(remotePeerId, stream);
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });
                }
            } catch (error) {
                console.error("Error setting up video call:", error);
            }
        };

        initializePeer();

        return () => {
            if (currentPeer) {
                currentPeer.destroy();
            }
        };
    }, [peerId, remotePeerId]);


    return (
        <div className="mt-6">
            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">Local Video</h2>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full border rounded-lg"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                        {isConnected ? "Remote Video" : "Waiting for connection..."}
                    </h2>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full border rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
export default VideoCall