import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-dark-bg p-4 md:p-8">
      {/* Immersive Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--color-neon-cyan) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--color-neon-magenta) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        
        {/* Header (Desktop) / Sidebar Contents */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 glass-surface">
                <Gamepad2 className="w-6 h-6 text-neon-cyan" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic leading-none">
                Neon<span className="text-neon-cyan">Rhythm</span>
              </h1>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] ml-13">
              Experimental Laboratory 07
            </p>
          </motion.div>

          {/* Snake Game Window */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SnakeGame />
          </motion.div>

          {/* Info Footer */}
          <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Protocol</span>
                <span className="text-xs font-mono text-white/60">TCP/SNAKE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Firmware</span>
                <span className="text-xs font-mono text-white/60">v2.4.0-neon</span>
              </div>
            </div>
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5 text-white/30" />
            </a>
          </div>
        </div>

        {/* Music Player Sidebar */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6 sticky top-8"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-neon-magenta" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Next Gen Audio</h2>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse-neon" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
          </div>
          
          <MusicPlayer />

          <div className="p-6 glass-surface rounded-3xl space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-white/40 tracking-widest border-b border-white/5 pb-2">Track Analyst</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/60">Energy Spectrum</span>
                <div className="flex gap-1 items-end h-4">
                  {[40, 70, 90, 50, 80, 60, 45].map((h, i) => (
                    <div key={i} className="w-1 bg-white/10 rounded-full" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Neural Fit</span>
                <span className="text-xs font-mono text-neon-lime">98.4 %</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
