import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SearchIcon, 
  FilterIcon, 
  PlusIcon, 
  XIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { toast } from "react-toastify";
import StudentCard from "../components/StudentCard";
import StudentStats from "../components/StudentStats";
import { getStudents, searchStudents } from "../services/studentService";
import { getCourses } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, coursesData] = await Promise.all([
          getStudents(),
          getCourses(),
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
        setFilteredStudents(studentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on search and course selection
  useEffect(() => {
    let result = [...students];
    
    // Apply search filter
    const handleSearch = async (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      
      try {
        if (value.trim() === "") {
          const allStudents = await getStudents();
          setFilteredStudents(allStudents);
        } else {
          const results = await searchStudents(value);
          setFilteredStudents(results);
        }
      } catch (err) {
        console.error("Error searching students:", err);
        toast.error("Failed to search students");
      }
    };

    if (activeFilter !== "all") {
      result = result.filter(student => student.course === activeFilter);
    }
    
    setFilteredStudents(result);
  }, [searchTerm, activeFilter, students]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
    setShowFilters(false);
  };

  // Toggle stats view with animation
  const toggleStatsView = () => {
    setShowStats(!showStats);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your students.
          </p>
        </div>
        <button
          onClick={() => navigate("/add")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Student
        </button>
      </div>

      {/* Statistics Section with Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Statistics Overview</h2>
          <button
            onClick={toggleStatsView}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {showStats ? 'Hide Statistics' : 'Show Statistics'}
          </button>
        </div>
        
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <StudentStats students={students} courses={courses} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${showFilters ? 'bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-200' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'} transition-colors`}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              {/* Active filters badge */}
              {(searchTerm || selectedCourse !== 'all') && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                  {(searchTerm ? 1 : 0) + (selectedCourse !== 'all' ? 1 : 0)}
                </span>
              )}
            </div>
            
            {(searchTerm || selectedCourse !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <XIcon className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
              <div className="w-full sm:w-64">
                <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  id="course-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
          </h2>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCourse !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding a new student.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/add")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Student
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <StudentCard student={student} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}