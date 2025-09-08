import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PencilIcon, 
  MailIcon, 
  AcademicCapIcon, 
  PhoneIcon,
  UserCircleIcon
} from "@heroicons/react/outline";
import { useState } from "react";

export default function StudentCard({ student }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  // Generate a gradient based on student's name for consistent colors
  const nameHash = student.name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const gradientColors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-amber-500 to-yellow-300',
    'from-rose-500 to-pink-400',
  ];
  
  const gradient = gradientColors[Math.abs(nameHash) % gradientColors.length];
  
  // Format course name to be URL-friendly
  const courseSlug = student.course?.toLowerCase().replace(/\s+/g, '-') || 'default-course';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      {/* Header with gradient */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
      
      {/* Student content */}
      <div className="p-5">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with hover effect */}
          <div className="relative mb-4">
            <div className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0D8ABC&color=fff&size=128`;
                  }}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${gradient} text-white`}>
                  <UserCircleIcon className="h-16 w-16 opacity-90" />
                </div>
              )}
            </div>
            
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
          </div>
          
          {/* Student name and course */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {student.name}
          </h3>
          
          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
            <span className="truncate">{student.course || 'No course assigned'}</span>
          </div>
          
          {/* Contact info toggle */}
          <div className="mt-3 w-full">
            <button
              onClick={() => setShowContact(!showContact)}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center mx-auto"
            >
              {showContact ? 'Hide contact info' : 'Show contact info'}
              <svg
                className={`ml-1 h-4 w-4 transform transition-transform ${showContact ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Contact info dropdown */}
            {showContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-left space-y-2 overflow-hidden"
              >
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MailIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  <a href={`mailto:${student.email}`} className="truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {student.email}
                  </a>
                </div>
                {student.phone && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <PhoneIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                    <a href={`tel:${student.phone.replace(/\D/g, '')}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {student.phone}
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
          <Link
            to={`/edit/${student.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <PencilIcon className="h-3 w-3 mr-1" />
            Edit
          </Link>
          
          <div className="flex space-x-2">
            <a
              href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(student.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              title="View on LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href={`mailto:${student.email}`}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Send email"
            >
              <span className="sr-only">Email</span>
              <MailIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Course tag */}
      {student.course && (
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            courseSlug.includes('react') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            courseSlug.includes('javascript') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            courseSlug.includes('html') || courseSlug.includes('css') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {student.course}
          </span>
        </div>
      )}
    </motion.div>
  );
}