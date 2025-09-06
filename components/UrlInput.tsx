import React from 'react';
import { SearchIcon, SparklesIcon } from './Icons';

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: () => void;
  onSmartSearch: () => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, onUrlChange, onSearch, onSmartSearch, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch();
    }
  };

  const handleSmartSearchClick = () => {
    if (!isLoading) {
      onSmartSearch();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Cole um link do YouTube ou descreva um vídeo..."
        className="w-full px-5 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
        disabled={isLoading}
      />
      <div className="flex w-full sm:w-auto items-center gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-300 disabled:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <SearchIcon className="w-5 h-5" />
          <span>{isLoading ? 'Buscando...' : 'Buscar'}</span>
        </button>
        <button
          type="button"
          onClick={handleSmartSearchClick}
          disabled={isLoading}
          aria-label="Busca Inteligente"
          className="p-3 bg-fuchsia-600 text-white font-semibold rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-fuchsia-500 transition-all duration-300 disabled:bg-fuchsia-800 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};