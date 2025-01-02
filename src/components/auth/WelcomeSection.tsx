import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export default function WelcomeSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <img
        src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963"
        alt="Beautiful landscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex flex-col justify-center px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white space-y-6"
        >
          <h1 className="text-4xl font-bold">Welcome to ChupKotha</h1>
          <p className="text-lg opacity-90">
            Share your moments, connect with friends, and discover amazing stories.
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9"
                alt="Feature"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1533050487297-09b450131914"
                alt="Feature"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}