import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XIcon, UserCircleIcon } from "@heroicons/react/outline";
import { PhotographIcon } from "@heroicons/react/solid";
import StudentForm from "../forms/StudentForm";
import { addStudent } from "../services/studentService";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export default function AddStudent() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Student</h1>
      <StudentForm />
    </section>
  );
}