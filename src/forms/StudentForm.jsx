import { useState, useEffect, useRef } from "react";
import { addStudent, getStudentById, updateStudent, getCourses, generateSearchTerms } from "../services/studentService";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  XIcon as XMarkIcon,
  PhotographIcon as PhotoIcon, 
  UserCircleIcon, 
  MailIcon as EnvelopeIcon, 
  AcademicCapIcon, 
  PhoneIcon, 
  LocationMarkerIcon as MapPinIcon 
} from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";

// Form validation schema
const studentSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number").nullable(),
  course: yup.string().required("Please select a course"),
  address: yup.string(),
  image: yup.string().url("Please enter a valid URL").nullable(),
  bio: yup.string().max(200, "Bio must be less than 200 characters"),
  enrollmentDate: yup.string(),
  status: yup.string(),
  notes: yup.string(),
  searchTerms: yup.array(),
});

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    enrollmentDate: '',
    address: '',
    status: 'active',
    notes: '',
    searchTerms: []
  });
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      ...formData,
      name: "",
      email: "",
      phone: "",
      course: "",
      address: "",
      image: "",
      bio: ""
    }
  });

  // Watch image URL for preview
  const imageUrl = watch("image");

  // Fetch student data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourses();
        setCourses(courseData);

        if (id) {
          const studentData = await getStudentById(id);
          if (studentData) {
            reset({
              ...studentData,
              // Ensure we have all fields to prevent undefined errors
              phone: studentData.phone || "",
              address: studentData.address || "",
              bio: studentData.bio || "",
            });
            if (studentData.image) {
              setPreviewImage(studentData.image);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, [id, reset]);

  // Handle image preview
  useEffect(() => {
    if (imageUrl) {
      // Basic URL validation
      try {
        new URL(imageUrl); // This will throw for invalid URLs
        setPreviewImage(imageUrl);
      } catch (e) {
        // Invalid URL, don't update preview
        if (previewImage && !imageUrl.startsWith('http')) {
          setPreviewImage(null);
        }
      }
    } else {
      setPreviewImage(null);
    }
  }, [imageUrl, previewImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // You would typically upload the file to a server here
        // For now, we'll just use the data URL
        setValue("image", reader.result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Update search terms when name or email changes
      if (name === 'name' || name === 'email' || name === 'course') {
        updated.searchTerms = generateSearchTerms(updated);
      }
      
      return updated;
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Generate search terms from form data
      const searchTerms = generateSearchTerms(data);
      const studentData = {
        ...data,
        searchTerms,
        enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
        status: data.status || 'active',
        // Ensure we have all required fields
        phone: data.phone || null,
        address: data.address || '',
        bio: data.bio || '',
        notes: data.notes || ''
      };
      
      if (id) {
        await updateStudent(id, studentData);
        toast.success('Student updated successfully!');
      } else {
        await addStudent(studentData);
        toast.success('Student added successfully!');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.message || 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {id ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {id ? 'Update student information' : 'Fill in the details to add a new student'}.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Profile Section */}
          <div className="px-6 py-6 space-y-6 sm:space-y-8">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                {previewImage ? (
                  <div className="relative group">
                    <img
                      className="h-24 w-24 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                      src={previewImage}
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setValue("image", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-pointer"
                  >
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    {previewImage ? 'Change photo' : 'Upload photo'}
                  </label>
                  <input
                    id="image-upload"
                    ref={fileInputRef}
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size 2MB
                </p>
                <input
                  type="hidden"
                  {...register("image")}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Basic details about the student.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md shadow-sm`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md shadow-sm`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md shadow-sm`}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="course"
                      {...register("course")}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.course ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md shadow-sm`}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      rows={3}
                      {...register("address")}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.address ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md shadow-sm`}
                      placeholder="123 Main St, City, Country"
                      defaultValue={''}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      rows={3}
                      {...register("bio")}
                      className={`block w-full shadow-sm border ${errors.bio ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'} rounded-md`}
                      placeholder="Tell us a bit about yourself..."
                      defaultValue={''}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Brief description for the student profile.
                  </p>
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-right">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {id ? 'Updating...' : 'Saving...'}
                </>
              ) : id ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}