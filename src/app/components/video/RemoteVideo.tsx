// Remote Video Component
import React from "react";

interface RemoteVideoProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    className?: string;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
                                                            videoRef,
                                                            className = "h-auto remote_video w-[300px] object-cover join-card object-contain fixed z-10 right-4 bottom-4 bg-slate-300 m-auto border border-gray-300 rounded"
                                                        }) => {
    return (
        <video
            ref={videoRef}
            autoPlay
            className={className}
        />
    );
};