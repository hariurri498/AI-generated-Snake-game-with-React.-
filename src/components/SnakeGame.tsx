import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
    isGameOver: false,
    isPaused: true,
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const moveRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    moveRef.current = 'RIGHT';
    setGameState(prev => ({ ...prev, score: 0, isGameOver: false, isPaused: false }));
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') moveRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (direction !== 'UP') moveRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') moveRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') moveRef.current = 'RIGHT';
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        const currentDir = moveRef.current;
        setDirection(currentDir);

        switch (currentDir) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Collision Check (Walls)
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          endGame();
          return prevSnake;
        }

        // Collision Check (Self)
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          endGame();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Check
        if (newHead.x === food.x && newHead.y === food.y) {
          setGameState(prev => {
            const newScore = prev.score + 10;
            const newHigh = Math.max(newScore, prev.highScore);
            localStorage.setItem('snake-high-score', newHigh.toString());
            return { ...prev, score: newScore, highScore: newHigh };
          });
          setFood(generateFood(newSnake));
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const endGame = () => {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [gameState.isGameOver, gameState.isPaused, food, generateFood, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear Canvas
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f3ff';
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : 'rgba(0, 243, 255, 0.6)';
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      
      // Eye for the head
      if (index === 0) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        const eyeSize = cellSize / 5;
        ctx.fillRect(x + cellSize/2 - eyeSize/2, y + cellSize/2 - eyeSize/2, eyeSize, eyeSize);
      }
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-dark-bg/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-yellow neon-glow-yellow" />
          <span className="text-xl font-bold tracking-tighter text-white/90">
            {gameState.score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-xs uppercase tracking-widest font-bold">Best</span>
          <span className="font-mono">{gameState.highScore}</span>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[400px] bg-black rounded-lg overflow-hidden border border-white/5 ring-1 ring-white/10">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block"
        />
        
        <AnimatePresence>
          {(gameState.isGameOver || gameState.isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-extrabold text-white tracking-widest uppercase italic">
                    Game Over
                  </h2>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2 bg-neon-magenta text-white font-bold rounded-full hover:scale-105 transition-transform neon-border-magenta"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-neon-cyan/20 border-2 border-neon-cyan rounded-full group-hover:scale-110 transition-transform neon-border-cyan">
                    <Play className="w-8 h-8 text-neon-cyan fill-neon-cyan" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-neon-cyan">Start</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] md:hidden">
        <div />
        <button onPointerDown={() => moveRef.current = 'UP'} className="p-4 bg-white/5 rounded-lg active:bg-neon-cyan/20">↑</button>
        <div />
        <button onPointerDown={() => moveRef.current = 'LEFT'} className="p-4 bg-white/5 rounded-lg active:bg-neon-cyan/20">←</button>
        <button onPointerDown={() => moveRef.current = 'DOWN'} className="p-4 bg-white/5 rounded-lg active:bg-neon-cyan/20">↓</button>
        <button onPointerDown={() => moveRef.current = 'RIGHT'} className="p-4 bg-white/5 rounded-lg active:bg-neon-cyan/20">→</button>
      </div>
      
      <div className="hidden md:block text-[10px] uppercase tracking-widest text-white/30 font-bold">
        Use Arrows to move • Space to pause
      </div>
    </div>
  );
}
