import { motion } from 'framer-motion';

interface UnreadBadgeProps {
  count: number;
}

export default function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
}