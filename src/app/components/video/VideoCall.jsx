"use client";

import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

const VideoCall = () => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [shareableLink, setShareableLink] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        // PeerJS instansiyasini yaratish
        const peer = new Peer();

        peer.on("open", (id) => {
            setPeerId(id); // O'z Peer ID'ni o'rnatish
            setShareableLink(`${window.location.origin}?peerId=${id}`);
        });

        peer.on("error", (err) => {
            setErrorMessage(`PeerJS xatosi: ${err.message}`);
        });

        peer.on("call", (call) => {
            // Qo'ng'iroqni qabul qilish
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    localVideoRef.current.srcObject = stream;
                    call.answer(stream); // Qo'ng'iroqqa javob berish

                    call.on("stream", (remoteStream) => {
                        remoteVideoRef.current.srcObject = remoteStream; // Uzoqdagi video oqimini o'rnatish
                    });
                })
                .catch((err) => {
                    setErrorMessage(`Kamerani ishga tushirishda xatolik: ${err.message}`);
                });
        });

        peerInstance.current = peer;
    }, []);

    const startCall = () => {
        // Qo'ng'iroq qilish
        if (!remotePeerId) {
            setErrorMessage("Iltimos, remote Peer ID ni kiriting.");
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
                const call = peerInstance.current.call(remotePeerId, stream);

                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream; // Uzoqdagi video oqimini o'rnatish
                });

                call.on("error", (err) => {
                    setErrorMessage(`Qo'ng'iroq xatosi: ${err.message}`);
                });
            })
            .catch((err) => {
                setErrorMessage(`Kamerani ishga tushirishda xatolik: ${err.message}`);
            });
    };

    return (
        <div>
            <h3>O'z Peer ID: {peerId}</h3>
            {shareableLink && (
                <div>
                    <p>Share this link with others:</p>
                    <input type="text" value={shareableLink} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(shareableLink)}>
                        Copy Link
                    </button>
                </div>
            )}
            <div style={{ margin: "10px 0" }}>
                <input
                    type="text"
                    placeholder="Remote Peer ID"
                    value={remotePeerId}
                    onChange={(e) => setRemotePeerId(e.target.value)}
                />
                <button onClick={startCall}>Qo'ng'iroqni boshlash</button>
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={{ width: "300px", border: "1px solid black" }}
                />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    style={{ width: "300px", border: "1px solid black" }}
                />
            </div>
        </div>
    );
};

export default VideoCall;
