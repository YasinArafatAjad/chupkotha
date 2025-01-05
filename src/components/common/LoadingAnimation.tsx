import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="grid grid-cols-3 gap-2"
        animate={{
          scale: [1, 0.9, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}