import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaDumbbell, FaYinYang as FaMeditation } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#fdf5eb] dark:bg-[#4b5161] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with solid background */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#f58b44]"></div>
          <div className="relative px-4 py-12 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-[#fdf5eb]">
              The page you're looking for doesn't exist in our mindfulness space
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#4b5161]/80 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-[#4b5161] dark:text-[#fdf5eb] mb-6">
              Take a deep breath
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-[#4b5161]/80 dark:text-[#fdf5eb]/80">
                We couldn't find the page you were looking for. But don't worry, 
                sometimes getting lost is part of the journey.
              </p>
              <p className="text-lg text-[#4b5161]/80 dark:text-[#fdf5eb]/80">
                Breathe in, and on the out breath, let's redirect you back to your mindfulness path.
              </p>
            </div>

            <div className="py-6 px-8 bg-[#fdf5eb] dark:bg-[#4b5161]/50 rounded-lg mb-8 border-l-4 border-[#f58b44]">
              <p className="text-lg font-medium text-[#f58b44]">
                "In the midst of movement and chaos, keep stillness inside of you."
              </p>
              <span className="block mt-2 text-sm text-[#4b5161]/60 dark:text-[#fdf5eb]/60">— Deepak Chopra</span>
            </div>

            {/* Navigation buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#f58b44] text-white rounded-lg hover:bg-[#d67a3a] transition-all duration-200 font-medium shadow-md">
                <FaHome size={18} />
                <span>Return Home</span>
              </Link>
              <Link
                to="/workshop"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4b5161] text-white rounded-lg hover:bg-[#3a3f4d] transition-all duration-200 font-medium shadow-md">
                <FaBook size={18} />
                <span>View Workshops</span>
              </Link>
              <Link
                to="/activities"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-[#4b5161]/20 dark:border-[#fdf5eb]/20 text-[#4b5161] dark:text-[#fdf5eb] rounded-lg hover:bg-[#4b5161]/10 dark:hover:bg-[#fdf5eb]/10 transition-all duration-200 font-medium">
                <FaDumbbell size={18} />
                <span>Try Activities</span>
              </Link>
            </div>
          </div>
          
          {/* Meditation Tip Card */}
          <div className="mt-8 bg-[#f58b44]/10 dark:bg-[#f58b44]/20 rounded-xl p-6 border border-[#f58b44]/20">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-[#f58b44] items-center justify-center flex-shrink-0">
                <FaMeditation className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#4b5161] dark:text-[#fdf5eb] mb-2">
                  Mindfulness Tip
                </h3>
                <p className="text-[#4b5161]/80 dark:text-[#fdf5eb]/80">
                  While you're here, take a moment to practice a brief mindfulness exercise: 
                  Close your eyes, take three deep breaths, and bring your attention to the 
                  present moment before continuing your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
