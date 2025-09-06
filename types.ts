export interface VideoInfo {
  id: string;
  thumbnailUrl: string;
  title: string;
  channel: string;
  duration: string;
  uploadDate: string;
  views: number;
  likes: number;
  description: string;
}

// Representa a seleção final do usuário a ser baixada.
export interface DownloadFormat {
  quality: string;
  format: string;
  size: string;
  type: 'video' | 'audio';
}

// Representa um par específico de formato e tamanho, por exemplo, { format: 'MP4', size: '128 MB' }
export interface FormatDetail {
  format: string;
  size: string;
}

// Representa um nível de qualidade e todas as suas opções de formato disponíveis.
export interface QualityOption {
  quality: string;
  type: 'video' | 'audio';
  formats: FormatDetail[];
}

export interface DownloadProgress {
  format: DownloadFormat;
  videoTitle: string;
  progress: number;
  status: 'downloading' | 'completed' | 'cancelled' | 'error';
}

export interface HistoryItem {
  id: string;
  videoTitle: string;
  format: DownloadFormat;
  timestamp: string;
}