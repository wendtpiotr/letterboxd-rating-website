import { motion } from 'framer-motion';

const LoadingScreen = ({ loading, step }) => {
  if (!loading || step !== 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border border-white/5 rounded-full" />
        <motion.div
          className="absolute inset-0 border-t border-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="text-[10px] text-white/20 tracking-[0.6em] uppercase animate-pulse">
        Establishing Connection
      </div>
    </div>
  );
};

export default LoadingScreen;
