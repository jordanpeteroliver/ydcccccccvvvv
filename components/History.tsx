import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon, TrashIcon, VideoIcon, AudioIcon } from './Icons';

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClearHistory }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-200 dark:border-gray-700/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Histórico de Downloads</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-red-500/10 dark:hover:bg-red-600/50 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-white rounded-md transition-colors duration-300"
          aria-label="Limpar histórico"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Limpar</span>
        </button>
      </div>
      
      {history.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum download no histórico.</p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {history.map((item, index) => (
            <li 
              key={item.id} 
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700/50 animate-fade-in-up transition-colors duration-300"
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              <div className="flex-shrink-0">
                {item.format.type === 'video' ? <VideoIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" /> : <AudioIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-gray-800 dark:text-white font-semibold truncate" title={item.videoTitle}>{item.videoTitle}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{item.format.quality} ({item.format.format})</span>
                  <span className="hidden sm:inline">·</span>
                  <span>{new Date(item.timestamp).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};