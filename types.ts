export interface VideoInfo {
  id: string;
  thumbnailUrl: string;
  title: string;
  channel: string;
  duration: string;
}

export interface DownloadFormat {
  quality: string;
  format: string;
  size: string;
  type: 'video' | 'audio';
}

export interface DownloadProgress {
  format: DownloadFormat;
  videoTitle: string;
  progress: number;
  status: 'downloading' | 'completed' | 'cancelled' | 'error';
}
