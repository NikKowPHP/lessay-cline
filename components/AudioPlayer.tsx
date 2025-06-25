// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: Implement TTS audio player
import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  audioData: ArrayBuffer | string;
};

export default function AudioPlayer({ audioData }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const blob = typeof audioData === 'string' 
      ? undefined 
      : new Blob([audioData], { type: 'audio/mp3' });
    
    const url = typeof audioData === 'string'
      ? audioData
      : URL.createObjectURL(blob);

    audio.src = url;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      if (typeof audioData !== 'string') URL.revokeObjectURL(url);
    };
  }, [audioData]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-32">
          <span className="text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolume}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: END