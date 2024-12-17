// Remote Video Component
import React from "react";

interface RemoteVideoProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    className?: string;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
                                                            videoRef,

                                                            className="object-contain fixed z-0 h-dvh top-0 left-0 right-0 bottom-0  border-gray-300 rounded m-auto"


                                                        }) => {
    return (
        <video
            ref={videoRef}
            autoPlay
            className={className}
        />
    );
};