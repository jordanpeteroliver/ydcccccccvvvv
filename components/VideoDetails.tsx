import React from 'react';
import type { VideoInfo } from '../types';

interface VideoDetailsProps {
  videoInfo: VideoInfo;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ videoInfo }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl shadow-black/20 border border-gray-700/50 flex flex-col md:flex-row gap-6 items-center">
      <img
        src={videoInfo.thumbnailUrl}
        alt={videoInfo.title}
        className="w-full md:w-64 h-auto object-cover rounded-lg shadow-lg"
      />
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2">
          {videoInfo.title}
        </h2>
        <p className="text-gray-400 text-md">{videoInfo.channel}</p>
        <span className="inline-block mt-2 bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          {videoInfo.duration}
        </span>
      </div>
    </div>
  );
};
