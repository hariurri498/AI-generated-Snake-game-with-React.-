import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-full max-w-sm glass-surface p-6 rounded-3xl neon-border-cyan flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex gap-4 items-center">
        <div 
          className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-black flex items-center justify-center border border-white/10"
          style={{ boxShadow: `0 0 20px ${currentTrack.color}33` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 10, opacity: 0, scale: 0.8 }}
            >
              <Music className="w-8 h-8" style={{ color: currentTrack.color }} />
            </motion.div>
          </AnimatePresence>
          
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end justify-center gap-[2px] pb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 16, 8, 20, 6] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    repeatType: "mirror" 
                  }}
                  className="w-1 rounded-full"
                  style={{ backgroundColor: currentTrack.color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-sm text-white/50 truncate font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 glass-surface"
            style={{ width: `${progress}%`, backgroundColor: `${currentTrack.color}55` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-white/40 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <SkipBack className="w-6 h-6 text-white/70 group-hover:text-white" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
            style={{ backgroundColor: currentTrack.color }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            )}
          </button>

          <button onClick={nextTrack} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <SkipForward className="w-6 h-6 text-white/70 group-hover:text-white" />
          </button>
        </div>

        <div className="w-5" /> {/* Spacer */}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 glass-surface rounded-xl flex flex-col pt-1">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/30">Latency</span>
          <span className="text-xs font-mono">1.2ms</span>
        </div>
        <div className="p-2 glass-surface rounded-xl flex flex-col pt-1">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/30">Sample</span>
          <span className="text-xs font-mono">48kHz</span>
        </div>
      </div>
    </div>
  );
}
