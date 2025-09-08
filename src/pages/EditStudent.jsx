import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XIcon as XMarkIcon, PhotographIcon as PhotoIcon, UserCircleIcon } from "@heroicons/react/outline";
import StudentForm from "../forms/StudentForm";
import { getStudentById, updateStudent } from "../services/studentService";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useTheme } from "../context/ThemeContext";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const studentData = await getStudentById(id);
        setStudent(studentData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      await updateStudent(id, updatedStudent);
      toast.success("Student updated successfully");
      navigate(`/students/${id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <h1 className={`text-3xl font-bold mb-6 text-${theme === "dark" ? "white" : "gray-800"}`}>Edit Student</h1>
      <StudentForm student={student} onUpdateStudent={handleUpdateStudent} />
    </section>
  );
}