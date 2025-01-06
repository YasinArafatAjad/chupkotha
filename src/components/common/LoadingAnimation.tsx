import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center ">
      <motion.div>
       <Loader className="w-4 h-4 animate-spin" />
      </motion.div>
    </div>
  );
}