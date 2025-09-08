export function validateStudent(student) {
  const errors = {};
  if (!student.name) errors.name = "Name is required";
  if (!student.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(student.email)) {
    errors.email = "Invalid email format";
  }
  if (!student.course) errors.course = "Course is required";
  return errors;
}