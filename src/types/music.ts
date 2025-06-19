export interface Track {
  // id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
}
