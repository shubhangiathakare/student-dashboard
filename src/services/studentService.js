// Simple in-memory mock store + async/await to simulate API + event loop demo
import courses from '../data/courses.js';
let students = [
  { id: "1", name: "John Doe", email: "john@example.com", course: "React In Depth", image: "" },
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export async function getStudents() {
  // Simulate network latency
  await sleep(500);
  return students;
}

export async function getStudentById(id) {
  await sleep(300);
  return students.find((s) => s.id === id);
}

export async function addStudent(student) {
  await sleep(300);
  student.id = Date.now().toString();
  students.push(student);
  return student;
}

export async function updateStudent(id, updated) {
  await sleep(300);
  students = students.map((s) => (s.id === id ? { ...s, ...updated } : s));
  return updated;
}

export async function deleteStudent(id) {
    await sleep(300);
    students = students.filter((s) => s.id !== id);
    return id;
}

export async function getCourses() {
  // Simulated API returning courses
  await sleep(250);
  return courses;
}

/**
 * Generates search terms from student data for efficient searching
 * @param {Object} student - Student data object
 * @returns {string[]} Array of search terms
 */
export function generateSearchTerms(student) {
  const terms = [];
  
  // Add full name and individual name parts
  if (student.name) {
    const nameLower = student.name.toLowerCase();
    terms.push(nameLower);
    
    // Add name parts as separate terms
    const nameParts = nameLower.split(/\s+/);
    terms.push(...nameParts);
    
    // Add name initials
    if (nameParts.length > 1) {
      const initials = nameParts.map(part => part[0]).join('');
      terms.push(initials);
    }
  }
  
  // Add email and username part
  if (student.email) {
    const emailLower = student.email.toLowerCase();
    terms.push(emailLower);
    
    // Add email username (part before @)
    const username = emailLower.split('@')[0];
    if (username) {
      terms.push(username);
    }
  }
  
  // Add course name if available
  if (student.course) {
    const courseLower = student.course.toLowerCase();
    terms.push(courseLower);
    
    // Add course words as separate terms
    terms.push(...courseLower.split(/\s+/));
  }
  
  // Remove duplicates and empty strings
  return [...new Set(terms.filter(term => term && term.length > 0))];
}

/**
 * Searches students based on a query string.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} A promise that resolves to an array of matching students.
 */
export async function searchStudents(query) {
  await sleep(200); // Simulate search latency
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    const allStudents = await getStudents();
    return allStudents;
  }

  const allStudents = await getStudents();
  
  const filtered = allStudents.filter(student => {
    const searchTerms = generateSearchTerms(student);
    return searchTerms.some(term => term.startsWith(normalizedQuery));
  });

  return filtered;
}
