import React, { useState, useMemo } from 'react';
import { SendIcon } from './Icons';
import type { VideoInfo } from '../types';

interface RefineSearchProps {
    onRefine: (prompt: string) => void;
    isRefining: boolean;
    videoInfo: VideoInfo | null;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ onRefine, isRefining, videoInfo }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isRefining) {
            onRefine(prompt.trim());
            setPrompt('');
        }
    };

    const handleQuickAction = (quickPrompt: string) => {
        if (!isRefining) {
            onRefine(quickPrompt);
        }
    };

    const suggestions = useMemo(() => {
        const suggestionsList: { label: string; prompt: string }[] = [];
        if (!videoInfo) return [];

        suggestionsList.push({ label: 'Outro parecido', prompt: 'Encontre outro vídeo parecido' });

        const durationParts = videoInfo.duration.split(':').map(Number);
        let durationInMinutes = 0;
        if (durationParts.length === 3) { // HH:MM:SS
            durationInMinutes = durationParts[0] * 60 + durationParts[1] + durationParts[2] / 60;
        } else if (durationParts.length === 2) { // MM:SS
            durationInMinutes = durationParts[0] + durationParts[1] / 60;
        }

        if (durationInMinutes > 10) {
            suggestionsList.push({ label: 'Mais curto', prompt: 'Mostre-me uma versão mais curta' });
        } else if (durationInMinutes > 0 && durationInMinutes < 5) {
            suggestionsList.push({ label: 'Mais longo', prompt: 'Encontre uma versão mais longa' });
        }
        
        // Analisa a data como UTC para evitar problemas de fuso horário
        const dateParts = videoInfo.uploadDate.split('-').map(Number);
        const utcUploadDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (utcUploadDate < oneYearAgo) {
            suggestionsList.push({ label: 'Mais recente', prompt: 'Encontre um vídeo mais recente sobre o mesmo assunto' });
        }
        
        const uniqueSuggestions = Array.from(new Map(suggestionsList.map(item => [item.label, item])).values());
        return uniqueSuggestions.slice(0, 3);
    }, [videoInfo]);

    return (
        <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-lg p-4 transition-colors duration-300">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Refinar Busca Inteligente</p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: 'encontre um mais recente' ou 'de outro canal'..."
                    className="w-full px-4 py-2 bg-white/50 dark:bg-gray-600/50 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
                    disabled={isRefining}
                />
                <button
                    type="submit"
                    disabled={isRefining || !prompt.trim()}
                    aria-label="Refinar busca"
                    className="p-2.5 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-fuchsia-500 transition-all disabled:bg-fuchsia-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sugestões:</span>
                {suggestions.map(({ label, prompt }) => (
                     <button 
                        key={label}
                        onClick={() => handleQuickAction(prompt)} 
                        className="px-3 py-1 bg-gray-300/70 dark:bg-gray-600/70 hover:bg-gray-400/70 dark:hover:bg-gray-600 rounded-full text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50" 
                        disabled={isRefining}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};