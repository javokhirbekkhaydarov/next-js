
import React from 'react';
import VideoIcon from "@/app/components/icons/VideoIcon";
import VideoOffIcon from "@/app/components/icons/VideoOffIcon";
import Microphone from "@/app/components/icons/Microphone";
import { MicrophoneOff } from "@/app/components/icons/MicrophoneOff";
import { EndCall } from "@/app/components/icons/EndCall";

// Video Control Actions Component
interface VideoControlsProps {
    isVideoOn: boolean;
    isMicrophoneOn: boolean;
    onToggleVideo: () => void;
    onToggleMicrophone: () => void;
    onEndCall: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
                                                                isVideoOn,
                                                                isMicrophoneOn,
                                                                onToggleVideo,
                                                                onToggleMicrophone,
                                                                onEndCall
                                                            }) => {
    return (
        <div className="actions fixed bottom-4 flex gap-4">
            <div className="icons flex space-x-4">
                <button
                    onClick={onToggleVideo}
                    className={'video'}
                >
                    {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
                </button>
                <button
                    onClick={onToggleMicrophone}
                    className={'video'}
                >
                    {isMicrophoneOn ? <Microphone /> : <MicrophoneOff />}
                </button>
                <button
                    onClick={onEndCall}
                    className={'video end_call'}
                >
                    <EndCall />
                </button>
            </div>
        </div>
    );
};