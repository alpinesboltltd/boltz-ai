import React from "react";

interface VideoPlayerProps {
  src: string;
  type?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type = "video/mp4",
  className = "w-full h-full",
}) => {
  return (
    <div className={`${className} overflow-hidden`}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={src} type={type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
