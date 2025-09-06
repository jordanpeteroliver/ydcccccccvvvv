import React from 'react';
// FIX: Renamed imported type to avoid conflict with component name.
import type { DownloadProgress as DownloadProgressType } from '../types';
import { VideoIcon, AudioIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface DownloadProgressProps {
  download: DownloadProgressType;
  onCancel: () => void;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({ download, onCancel }) => {
  const { format, videoTitle, progress, status } = download;
  const isVideo = format.type === 'video';
  const fileName = `${videoTitle.substring(0, 30)}... - ${format.quality}.${format.format.toLowerCase()}`;

  const getStatusInfo = () => {
    switch (status) {
      case 'downloading':
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-blue-100',
          icon: isVideo ? <VideoIcon className="w-5 h-5" /> : <AudioIcon className="w-5 h-5" />,
          message: `${Math.round(progress)}%`,
        };
      case 'completed':
        return {
          bgColor: 'bg-green-600',
          textColor: 'text-green-100',
          icon: <CheckCircleIcon className="w-5 h-5" />,
          message: 'Concluído!',
        };
      case 'cancelled':
      case 'error':
        return {
          bgColor: 'bg-red-600',
          textColor: 'text-red-100',
          icon: <XCircleIcon className="w-5 h-5" />,
          message: 'Falhou',
        };
      default:
        return { bgColor: 'bg-gray-600', textColor: 'text-gray-100', icon: null, message: '' };
    }
  };

  const { bgColor, textColor, icon, message } = getStatusInfo();

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white p-4 animate-fade-in-up z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
          {icon}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold truncate" title={fileName}>{fileName}</p>
          <div className="mt-1.5 h-2 w-full bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`${bgColor} h-full rounded-full transition-all duration-300 ease-linear`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm font-mono w-16 text-right">{message}</div>
        {status === 'downloading' && (
          <button onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Cancelar download">
            <XCircleIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};