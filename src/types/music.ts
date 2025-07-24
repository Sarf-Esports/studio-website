export interface Track {
  title: string;
  artist: string;
  src: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
}
