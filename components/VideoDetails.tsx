import React from 'react';
import type { VideoInfo } from '../types';
import { EyeIcon, ThumbsUpIcon, CalendarIcon } from './Icons';

interface VideoDetailsProps {
  videoInfo: VideoInfo;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ videoInfo }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        // Adiciona 1 dia para corrigir problemas de fuso horário que podem fazer a data retroceder.
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return "Data inválida";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-200 dark:border-gray-700/50 flex flex-col md:flex-row gap-6 items-start transition-colors duration-300">
      <img
        src={videoInfo.thumbnailUrl}
        alt={videoInfo.title}
        className="w-full md:w-64 h-auto object-cover rounded-lg shadow-lg flex-shrink-0"
      />
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2" title={videoInfo.title}>
          {videoInfo.title}
        </h2>
        <div className='flex items-center justify-center md:justify-start gap-4 mb-3'>
            <p className="text-gray-600 dark:text-gray-400 text-md">{videoInfo.channel}</p>
            <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            {videoInfo.duration}
            </span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-1.5" title={`${new Intl.NumberFormat('pt-BR').format(videoInfo.views)} visualizações`}>
                <EyeIcon className="w-4 h-4" />
                <span>{formatNumber(videoInfo.views)}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${new Intl.NumberFormat('pt-BR').format(videoInfo.likes)} curtidas`}>
                <ThumbsUpIcon className="w-4 h-4" />
                <span>{formatNumber(videoInfo.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(videoInfo.uploadDate)}</span>
            </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm text-left line-clamp-3">
          {videoInfo.description}
        </p>
      </div>
    </div>
  );
};