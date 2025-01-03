import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
      >
        {count > 99 ? '99+' : count}
      </motion.div>
    </AnimatePresence>
  );
}