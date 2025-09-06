import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UrlInput } from './components/UrlInput';
import { Loader } from './components/Loader';
import { VideoDetails } from './components/VideoDetails';
import { DownloadOptions } from './components/DownloadOptions';
import { DownloadProgress } from './components/DownloadProgress';
import { YouTubeIcon } from './components/Icons';
import type { VideoInfo, DownloadFormat, DownloadProgress as DownloadProgressType } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [download, setDownload] = useState<DownloadProgressType | null>(null);

  const downloadIntervalRef = useRef<number | null>(null);

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
    if (download?.status === 'completed' || download?.status === 'cancelled' || download?.status === 'error') {
      const timer = setTimeout(() => {
        setDownload(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [download?.status]);

  useEffect(() => {
    return () => clearDownloadInterval();
  }, []);

  const handleSearch = useCallback(async () => {
    if (download?.status === 'downloading') return;
    setError(null);
    setVideoInfo(null);
    if (!url || !isValidYoutubeUrl(url)) {
      setError('Por favor, insira um URL válido do YouTube.');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockVideoInfo: VideoInfo = {
      id: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://picsum.photos/seed/youtubedl/1280/720',
      title: 'Título do Vídeo de Exemplo - Lorem Ipsum Dolor Sit Amet Consectetur',
      channel: 'Canal de Exemplo',
      duration: '03:32',
    };

    setVideoInfo(mockVideoInfo);
    setIsLoading(false);
  }, [url, download]);
  
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    if(error) setError(null);
  }, [error]);

  const isValidYoutubeUrl = (urlToTest: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(urlToTest);
  };

  const isDownloading = download?.status === 'downloading';
  const isBusy = isLoading || isDownloading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
             <YouTubeIcon className="w-16 h-16 text-red-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Downloader de Mídia
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Cole o link do vídeo do YouTube para baixar em vídeo ou áudio.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl shadow-black/20 border border-gray-700/50">
            <UrlInput
              url={url}
              onUrlChange={handleUrlChange}
              onSearch={handleSearch}
              isLoading={isBusy}
            />
            {error && (
              <p className="text-red-400 text-center mt-4 animate-pulse">{error}</p>
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
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Downloader de Mídia. Todos os direitos reservados.</p>
          <p className="mt-1">Este é um protótipo de UI e não realiza downloads reais.</p>
        </footer>
      </div>
      {download && (
        <DownloadProgress download={download} onCancel={handleDownloadCancel} />
      )}
    </div>
  );
};

export default App;
