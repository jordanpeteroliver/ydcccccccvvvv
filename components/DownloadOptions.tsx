import React, { useState } from 'react';
import type { DownloadFormat } from '../types';
import { DownloadIcon, VideoIcon, AudioIcon } from './Icons';

const mockVideoFormats: DownloadFormat[] = [
  { quality: '1080p', format: 'MP4', size: '128 MB', type: 'video' },
  { quality: '720p', format: 'MP4', size: '75 MB', type: 'video' },
  { quality: '480p', format: 'MP4', size: '42 MB', type: 'video' },
  { quality: '360p', format: 'MP4', size: '25 MB', type: 'video' },
];

const mockAudioFormats: DownloadFormat[] = [
  { quality: '320kbps', format: 'MP3', size: '8.5 MB', type: 'audio' },
  { quality: '256kbps', format: 'MP3', size: '6.8 MB', type: 'audio' },
  { quality: '128kbps', format: 'MP3', size: '3.4 MB', type: 'audio' },
  { quality: 'Best', format: 'M4A', size: '5.1 MB', type: 'audio' },
];

interface DownloadButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled }) => {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            <DownloadIcon className="w-5 h-5" />
            <span>Baixar</span>
        </button>
    );
};

interface FormatRowProps {
    format: DownloadFormat;
    onDownload: (format: DownloadFormat) => void;
    disabled: boolean;
}

const FormatRow: React.FC<FormatRowProps> = ({ format, onDownload, disabled }) => (
    <div className={`grid grid-cols-3 sm:grid-cols-4 items-center p-4 gap-y-3 border-b border-gray-700 last:border-b-0 ${disabled ? 'opacity-50' : 'hover:bg-gray-700/50 transition-colors duration-200'}`}>
        <div className="font-semibold text-white">{format.quality}</div>
        <div className="text-gray-400">{format.format}</div>
        <div className="text-gray-400">{format.size}</div>
        <div className="col-span-3 sm:col-span-1 flex justify-end">
             <DownloadButton onClick={() => onDownload(format)} disabled={disabled} />
        </div>
    </div>
);


interface DownloadOptionsProps {
    onDownloadStart: (format: DownloadFormat) => void;
    isDownloading: boolean;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({ onDownloadStart, isDownloading }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-black/20 border border-gray-700/50 overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('video')}
          disabled={isDownloading}
          className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold transition-colors duration-300 ${activeTab === 'video' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'} disabled:bg-gray-600/50 disabled:text-gray-400`}
        >
          <VideoIcon className="w-5 h-5" />
          Vídeo
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          disabled={isDownloading}
          className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold transition-colors duration-300 ${activeTab === 'audio' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'} disabled:bg-gray-600/50 disabled:text-gray-400`}
        >
          <AudioIcon className="w-5 h-5" />
          Áudio
        </button>
      </div>

      <div>
        {activeTab === 'video' && (
          <div className="animate-fade-in">
            {mockVideoFormats.map((format) => (
              <FormatRow key={format.quality + format.format} format={format} onDownload={onDownloadStart} disabled={isDownloading} />
            ))}
          </div>
        )}
        {activeTab === 'audio' && (
          <div className="animate-fade-in">
            {mockAudioFormats.map((format) => (
              <FormatRow key={format.quality + format.format} format={format} onDownload={onDownloadStart} disabled={isDownloading} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};