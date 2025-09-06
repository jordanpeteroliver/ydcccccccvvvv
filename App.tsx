import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Chat } from "@google/genai";
// FIX: The v9 modular imports for Firestore were causing errors. They have been removed.
// import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, writeBatch } from 'firebase/firestore';
// FIX: Import firebase/compat/app to use FieldValue.serverTimestamp() from the v8 compat SDK.
import firebase from 'firebase/compat/app';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';

import { UrlInput } from './components/UrlInput';
import { Loader } from './components/Loader';
import { VideoDetails } from './components/VideoDetails';
import { DownloadOptions } from './components/DownloadOptions';
import { DownloadProgress } from './components/DownloadProgress';
import { History } from './components/History';
import { Auth } from './components/Auth';
import { RefineSearch } from './components/RefineSearch';
import { YouTubeIcon } from './components/Icons';
import type { VideoInfo, DownloadFormat, DownloadProgress as DownloadProgressType, HistoryItem } from './types';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const App: React.FC = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [download, setDownload] = useState<DownloadProgressType | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isSmartSearchResult, setIsSmartSearchResult] = useState<boolean>(false);

  const downloadIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
        setHistory([]);
        return;
    }

    // FIX: Using Firebase v8 syntax for collection, query, orderBy, and onSnapshot.
    const historyCollectionRef = db.collection('users').doc(user.uid).collection('history');
    const q = historyCollectionRef.orderBy('timestamp', 'desc');

    const unsubscribe = q.onSnapshot((querySnapshot) => {
        const historyData: HistoryItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            historyData.push({
                id: doc.id,
                videoTitle: data.videoTitle,
                format: data.format,
                timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
            });
        });
        setHistory(historyData);
    }, (err) => {
        console.error("Error fetching history:", err);
        setError("Não foi possível carregar o histórico.");
    });

    return () => unsubscribe();
  }, [user]);

  const clearDownloadInterval = () => {
    if (downloadIntervalRef.current) {
      clearInterval(downloadIntervalRef.current);
      downloadIntervalRef.current = null;
    }
  };
  
  const handleDownloadStart = useCallback((format: DownloadFormat) => {
    if (!videoInfo || download) return;

    setDownload({
      format,
      videoTitle: videoInfo.title,
      progress: 0,
      status: 'downloading',
    });

    downloadIntervalRef.current = window.setInterval(() => {
      setDownload(prev => {
        if (!prev) {
          clearDownloadInterval();
          return null;
        }
        const newProgress = prev.progress + Math.random() * 5 + 2;
        if (newProgress >= 100) {
          clearDownloadInterval();
          return { ...prev, progress: 100, status: 'completed' };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200);
  }, [videoInfo, download]);

  const handleDownloadCancel = useCallback(() => {
    clearDownloadInterval();
    setDownload(prev => prev ? { ...prev, status: 'cancelled' } : null);
  }, []);

  useEffect(() => {
    if (!download) return;

    if (download.status === 'completed' && user) {
      // FIX: Using Firebase v8 syntax for serverTimestamp.
      const newHistoryItem = {
        videoTitle: download.videoTitle,
        format: download.format,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      
      // FIX: Using Firebase v8 syntax for collection and addDoc (now .add).
      const historyCollectionRef = db.collection('users').doc(user.uid).collection('history');
      historyCollectionRef.add(newHistoryItem).catch(e => {
        console.error("Error adding document to history: ", e);
      });
    }
    
    if (download.status === 'completed' || download.status === 'cancelled' || download.status === 'error') {
      const timer = setTimeout(() => {
        setDownload(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [download, user]);

  useEffect(() => {
    return () => clearDownloadInterval();
  }, []);

  const handleClearHistory = useCallback(async () => {
    if (!user || history.length === 0) return;

    // FIX: Using Firebase v8 syntax for collection.
    const historyCollectionRef = db.collection('users').doc(user.uid).collection('history');
    try {
        // FIX: Using Firebase v8 syntax for getDocs (now .get).
        const querySnapshot = await historyCollectionRef.get();
        // FIX: Using Firebase v8 syntax for writeBatch (now db.batch).
        const batch = db.batch();
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch(e) {
        console.error("Error clearing history: ", e);
        setError("Falha ao limpar o histórico.");
    }
  }, [user, history.length]);

  const performSearch = async (searchLogic: () => Promise<void>) => {
    if (download?.status === 'downloading') return;
    if (videoInfo) setVideoInfo(null);
    setError(null);
    await searchLogic();
  };

  const resetSmartSearch = () => {
    setIsSmartSearchResult(false);
    setChatSession(null);
  };

  const handleSearch = useCallback(async () => {
    resetSmartSearch();
    await performSearch(async () => {
        if (!url || !isValidYoutubeUrl(url)) {
          setError('Por favor, insira um URL válido do YouTube.');
          return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockVideoInfo: VideoInfo = {
          id: 'dQw4w9WgXcQ',
          thumbnailUrl: 'https://picsum.photos/seed/youtubedl/1280/720',
          title: 'Título do Vídeo de Exemplo - Lorem Ipsum Dolor Sit Amet Consectetur',
          channel: 'Canal de Exemplo',
          duration: '03:32',
          uploadDate: '2023-10-26',
          views: 1234567,
          likes: 98765,
          description: 'Esta é uma descrição de exemplo para o vídeo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        };
        setVideoInfo(mockVideoInfo);
        setIsLoading(false);
    });
  }, [url, download, videoInfo]);

  const handleInitialSmartSearch = useCallback(async () => {
    if (download?.status === 'downloading') return;
    setError(null);
    if (!url) {
      setError('Por favor, digite algo para a busca inteligente.');
      return;
    }
    setIsLoading(true);
    setVideoInfo(null);

    try {
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'Você é um assistente prestativo de busca de vídeos do YouTube. O usuário fornecerá uma consulta e você encontrará um vídeo adequado. Você também pode refinar a busca com base em solicitações de acompanhamento. Sempre responda APENAS com o objeto JSON solicitado.'
        }
      });
      setChatSession(newChat);

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Título do vídeo' },
          channel: { type: Type.STRING, description: 'Nome do canal do YouTube' },
          duration: { type: Type.STRING, description: 'Duração do vídeo no formato MM:SS ou HH:MM:SS' },
          uploadDate: { type: Type.STRING, description: 'Data de upload do vídeo no formato YYYY-MM-DD' },
          views: { type: Type.INTEGER, description: 'Número aproximado de visualizações' },
          likes: { type: Type.INTEGER, description: 'Número aproximado de curtidas' },
          description: { type: Type.STRING, description: 'Descrição curta do vídeo (máximo 200 caracteres)' },
        },
        required: ['title', 'channel', 'duration', 'uploadDate', 'views', 'likes', 'description'],
      };

      const result = await newChat.sendMessage({
        message: `Encontre um vídeo do YouTube para esta consulta: "${url}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
      });
      
      const videoData = JSON.parse(result.text);

      const generatedVideoInfo: VideoInfo = {
        id: `gemini-${Date.now()}`,
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(videoData.title)}/1280/720`,
        title: videoData.title,
        channel: videoData.channel,
        duration: videoData.duration,
        uploadDate: videoData.uploadDate,
        views: videoData.views,
        likes: videoData.likes,
        description: videoData.description,
      };
      setVideoInfo(generatedVideoInfo);
      setIsSmartSearchResult(true);
    } catch (e) {
      console.error("Smart search failed:", e);
      setError('A busca inteligente falhou. Tente novamente.');
      resetSmartSearch();
    } finally {
      setIsLoading(false);
    }
  }, [url, download]);
  
  const handleRefineSearch = useCallback(async (prompt: string) => {
    if (!chatSession) {
        setError("Sessão de busca inteligente não encontrada. Inicie uma nova busca.");
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título do vídeo' },
            channel: { type: Type.STRING, description: 'Nome do canal do YouTube' },
            duration: { type: Type.STRING, description: 'Duração do vídeo no formato MM:SS ou HH:MM:SS' },
            uploadDate: { type: Type.STRING, description: 'Data de upload do vídeo no formato YYYY-MM-DD' },
            views: { type: Type.INTEGER, description: 'Número aproximado de visualizações' },
            likes: { type: Type.INTEGER, description: 'Número aproximado de curtidas' },
            description: { type: Type.STRING, description: 'Descrição curta do vídeo (máximo 200 caracteres)' },
          },
          required: ['title', 'channel', 'duration', 'uploadDate', 'views', 'likes', 'description'],
        };
        const result = await chatSession.sendMessage({
            message: `Ok, agora refine a busca anterior com esta instrução: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        const videoData = JSON.parse(result.text);

        const generatedVideoInfo: VideoInfo = {
            id: `gemini-${Date.now()}`,
            thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(videoData.title)}/1280/720`,
            title: videoData.title,
            channel: videoData.channel,
            duration: videoData.duration,
            uploadDate: videoData.uploadDate,
            views: videoData.views,
            likes: videoData.likes,
            description: videoData.description,
        };
        setVideoInfo(generatedVideoInfo);

    } catch (e) {
        console.error("Refine search failed:", e);
        setError('O refinamento da busca falhou. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  }, [chatSession]);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    if(error) setError(null);
    if (isSmartSearchResult) {
        resetSmartSearch();
    }
  }, [error, isSmartSearchResult]);

  const isValidYoutubeUrl = (urlToTest: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(urlToTest);
  };

  const isDownloading = download?.status === 'downloading';
  const isBusy = isLoading || isDownloading;

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800 font-sans p-4 sm:p-6 lg:p-8 relative transition-colors duration-300">
       <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <ThemeSwitcher />
            <Auth />
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
             <YouTubeIcon className="w-16 h-16 text-red-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Downloader de Mídia
            </h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Cole o link do vídeo do YouTube para baixar em vídeo ou áudio.
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-200 dark:border-gray-700/50 transition-colors duration-300">
            <UrlInput
              url={url}
              onUrlChange={handleUrlChange}
              onSearch={handleSearch}
              onSmartSearch={handleInitialSmartSearch}
              isLoading={isBusy}
            />
            {error && (
              <p className="text-red-500 dark:text-red-400 text-center mt-4 animate-pulse">{error}</p>
            )}
            {isSmartSearchResult && !isBusy && videoInfo && (
                <div className="mt-4 animate-fade-in">
                    <RefineSearch onRefine={handleRefineSearch} isRefining={isLoading} videoInfo={videoInfo} />
                </div>
            )}
          </div>
          
          <div className="mt-8 transition-all duration-500">
            {isLoading && <Loader />}
            
            {videoInfo && !isLoading && (
              <div className="animate-fade-in-up">
                <VideoDetails videoInfo={videoInfo} />
                <DownloadOptions 
                  onDownloadStart={handleDownloadStart}
                  isDownloading={isDownloading}
                />
              </div>
            )}
          </div>

          {user && history.length > 0 && (
              <div className="mt-8 animate-fade-in-up">
                  <History history={history} onClearHistory={handleClearHistory} />
              </div>
          )}
          {!user && videoInfo && !isBusy && (
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 animate-fade-in-up transition-colors duration-300">
              <p>👋 Entre com sua conta Google para salvar seu histórico de downloads.</p>
            </div>
          )}
        </main>

        <footer className="text-center mt-12 text-gray-600 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Downloader de Mídia. Todos os direitos reservados.</p>
          <p className="mt-1">Este é um protótipo de UI e não realiza downloads reais.</p>
        </footer>
      {download && (
        <DownloadProgress download={download} onCancel={handleDownloadCancel} />
      )}
    </div>
  );
};

export default App;