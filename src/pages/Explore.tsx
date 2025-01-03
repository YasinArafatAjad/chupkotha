import { motion } from 'framer-motion';
import SearchBar from '../components/Search/SearchBar';

export default function Explore() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6 p-4"
    >
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <SearchBar />
    </motion.div>
  );
}