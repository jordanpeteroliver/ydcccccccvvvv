import React, { useState } from 'react';
import type { DownloadFormat, QualityOption, FormatDetail } from '../types';
import { DownloadIcon, VideoIcon, AudioIcon } from './Icons';

const mockVideoQualities: QualityOption[] = [
  { quality: '1080p', type: 'video', formats: [
      { format: 'MP4', size: '128 MB' },
      { format: 'WEBM', size: '95 MB' },
  ]},
  { quality: '720p', type: 'video', formats: [
      { format: 'MP4', size: '75 MB' },
      { format: 'WEBM', size: '50 MB' },
  ]},
  { quality: '480p', type: 'video', formats: [
      { format: 'MP4', size: '42 MB' },
  ]},
  { quality: '360p', type: 'video', formats: [
      { format: 'MP4', size: '25 MB' },
      { format: '3GP', size: '15 MB' },
  ]},
];

const mockAudioQualities: QualityOption[] = [
  { quality: 'Alta (320kbps)', type: 'audio', formats: [
      { format: 'MP3', size: '8.5 MB' },
      { format: 'M4A', size: '7.1 MB' },
      { format: 'FLAC', size: '25 MB' },
  ]},
  { quality: 'Média (256kbps)', type: 'audio', formats: [
      { format: 'MP3', size: '6.8 MB' },
      { format: 'M4A', size: '5.5 MB' },
      { format: 'OPUS', size: '3.4 MB' },
  ]},
  { quality: 'Baixa (128kbps)', type: 'audio', formats: [
      { format: 'MP3', size: '3.4 MB' },
      { format: 'OPUS', size: '1.7 MB' },
  ]},
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            <DownloadIcon className="w-5 h-5" />
            <span>Baixar</span>
        </button>
    );
};

interface FormatRowProps {
    qualityOption: QualityOption;
    onDownload: (format: DownloadFormat) => void;
    disabled: boolean;
}

const FormatRow: React.FC<FormatRowProps> = ({ qualityOption, onDownload, disabled }) => {
    const [selectedFormat, setSelectedFormat] = useState<FormatDetail>(qualityOption.formats[0]);

    const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenFormat = qualityOption.formats.find(f => f.format === event.target.value);
        if (chosenFormat) {
            setSelectedFormat(chosenFormat);
        }
    };

    const handleDownload = () => {
        onDownload({
            quality: qualityOption.quality,
            format: selectedFormat.format,
            size: selectedFormat.size,
            type: qualityOption.type,
        });
    };

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-4 items-center p-4 gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${disabled ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200'}`}>
            <div className="font-semibold text-gray-800 dark:text-white">{qualityOption.quality}</div>
            
            <div className="text-gray-500 dark:text-gray-400 text-right sm:text-center">{selectedFormat.size}</div>

            <div className="col-span-1">
                <select
                    value={selectedFormat.format}
                    onChange={handleFormatChange}
                    disabled={disabled || qualityOption.formats.length <= 1}
                    aria-label="Selecionar formato"
                    className="w-full bg-gray-100 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {qualityOption.formats.map(f => (
                        <option key={f.format} value={f.format}>
                            {f.format}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="col-span-1 flex justify-end">
                 <DownloadButton onClick={handleDownload} disabled={disabled} />
            </div>
        </div>
    );
};


interface DownloadOptionsProps {
    onDownloadStart: (format: DownloadFormat) => void;
    isDownloading: boolean;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({ onDownloadStart, isDownloading }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

  const qualities = activeTab === 'video' ? mockVideoQualities : mockAudioQualities;

  return (
    <div className="mt-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-colors duration-300">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('video')}
          disabled={isDownloading}
          className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold transition-colors duration-300 ${activeTab === 'video' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} disabled:bg-gray-200 dark:disabled:bg-gray-600/50 disabled:text-gray-400`}
        >
          <VideoIcon className="w-5 h-5" />
          Vídeo
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          disabled={isDownloading}
          className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold transition-colors duration-300 ${activeTab === 'audio' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} disabled:bg-gray-200 dark:disabled:bg-gray-600/50 disabled:text-gray-400`}
        >
          <AudioIcon className="w-5 h-5" />
          Áudio
        </button>
      </div>

      <div key={activeTab} className="animate-fade-in">
        {qualities.map((qualityOption) => (
            <FormatRow 
                key={qualityOption.quality} 
                qualityOption={qualityOption} 
                onDownload={onDownloadStart} 
                disabled={isDownloading} 
            />
        ))}
      </div>
    </div>
  );
};