import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingAnimation from "../common/LoadingAnimation";
import ImageUpload from "./ImageUpload";
import toast from 'react-hot-toast';

interface SignUpFormProps {
  onSubmit: (
    email: string,
    password: string,
    displayName: string,
    birthDate: string,
    profileImage: File | null
  ) => Promise<void>;
  loading: boolean;
}

export default function SignUpForm({ onSubmit, loading }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateBirthDate = () => {
    if (!birthDate) {
      toast.error('Birth date is required');
      return false;
    }

    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 13) {
      toast.error('You must be at least 13 years old to sign up');
      return false;
    }

    if (birth > today) {
      toast.error('Birth date cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    if (!validateBirthDate()) return;

    await onSubmit(email, password, displayName, birthDate, profileImage);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="logo-icon w-[6rem] h-[6rem]">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100px"
              viewBox="0 0 352.000000 159.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,159.000000) scale(0.100000,-0.100000)"
                fill="#ad0808"
                stroke="none"
              >
                <path d="M10 1550 c0 -44 43 -132 91 -184 131 -143 337 -205 642 -191 90 3 147 2 147 -3 0 -14 -20 -20 -117 -33 -129 -17 -317 -6 -423 25 -47 13 -87 23 -89 21 -11 -12 28 -71 71 -110 73 -65 144 -85 309 -85 140 0 297 27 439 75 83 28 90 29 90 14 0 -15 -153 -84 -229 -104 -35 -9 -105 -22 -155 -29 l-91 -12 35 -22 c83 -52 224 -67 344 -36 61 16 176 67 228 100 38 25 47 9 14 -25 -25 -26 -119 -79 -169 -95 -27 -9 -13 -22 40 -40 68 -23 121 -20 213 14 95 35 150 38 195 10 57 -35 113 -139 146 -268 7 -28 16 -52 19 -52 4 0 12 22 18 48 28 124 89 238 144 272 46 28 103 25 200 -11 93 -35 159 -36 233 -4 l40 17 -55 24 c-70 31 -150 85 -150 102 0 17 2 17 103 -33 112 -55 188 -75 283 -75 78 0 187 28 224 58 22 17 20 18 -78 30 -169 21 -399 108 -369 139 3 3 39 -6 79 -20 41 -14 131 -38 201 -52 111 -24 145 -26 270 -23 131 3 147 5 205 32 64 30 125 86 143 133 5 14 8 27 7 29 -2 1 -41 -9 -88 -22 -66 -20 -116 -26 -225 -30 -153 -5 -305 11 -313 34 -3 11 21 12 134 7 348 -18 604 78 702 262 17 32 34 76 38 98 l7 39 -50 -42 c-28 -23 -77 -55 -109 -71 -110 -54 -169 -62 -529 -71 -463 -12 -624 -38 -774 -127 -123 -74 -236 -224 -272 -362 -7 -28 -16 -51 -19 -51 -4 0 -14 26 -24 58 -46 147 -132 264 -252 342 -152 99 -311 127 -794 140 -344 9 -407 17 -510 62 -31 14 -81 46 -113 72 -48 39 -57 43 -57 26z" />
                <path d="M1350 1377 c3 -3 37 -17 75 -31 88 -33 164 -85 216 -147 42 -50 109 -170 109 -195 0 -8 5 -14 10 -14 6 0 10 6 10 14 0 26 70 152 112 200 53 62 140 118 226 147 80 27 62 35 -47 20 -145 -19 -246 -77 -281 -161 -7 -16 -15 -30 -19 -30 -4 0 -15 16 -26 36 -31 57 -100 112 -169 133 -57 17 -227 39 -216 28z" />
                <path d="M1583 757 c88 -246 41 -473 -118 -574 -25 -15 -45 -32 -45 -37 0 -13 91 4 134 26 21 11 52 34 67 51 35 38 46 30 31 -21 -16 -52 -64 -117 -112 -150 -62 -43 -52 -51 39 -31 66 14 126 59 153 114 12 25 25 45 28 45 4 0 15 -18 25 -39 32 -72 91 -112 188 -126 30 -5 47 -4 47 3 0 6 -9 13 -19 17 -35 11 -107 99 -130 158 -32 88 -24 104 21 38 28 -42 96 -78 163 -86 l50 -6 -29 23 c-79 61 -118 105 -149 167 -31 63 -32 70 -31 186 0 94 5 134 22 185 24 71 21 87 -9 50 -40 -50 -91 -171 -117 -279 -15 -61 -29 -111 -32 -111 -3 0 -17 49 -31 109 -31 129 -79 238 -122 278 -21 19 -28 23 -24 10z" />
              </g>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Create account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
          Join our community of photographers and creators
        </p>
      </div>

      <ImageUpload imageUrl={imagePreview} onImageChange={setProfileImage} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Birth Date
            </label>
            <input
              id="birthDate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
          >
            {loading ? <LoadingAnimation /> : "Create Account"}
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
}