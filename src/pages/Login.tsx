import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signInWithGoogle } from '../lib/auth/googleAuth';
import toast from 'react-hot-toast';
import LoadingAnimation from '../components/common/LoadingAnimation';
import GoogleButton from '../components/auth/GoogleButton';
import ForgotPassword from '../components/auth/ForgotPassword';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = (() => {
        switch (error.code) {
          case 'auth/invalid-email':
            return 'Invalid email address';
          case 'auth/user-disabled':
            return 'This account has been disabled';
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            return 'Invalid email or password';
          default:
            return 'Failed to log in';
        }
      })();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
              </div>

              <form className="space-y-6" onSubmit={handleEmailLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 pr-10"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-primary hover:text-primary/90"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? <LoadingAnimation /> : 'Sign in'}
                </button>
              </form>

              <GoogleButton onClick={signInWithGoogle} />

              <p className="text-center text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}