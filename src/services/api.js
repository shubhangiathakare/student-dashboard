import courses from '../data/courses';

// Simulate a network request
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCourses = async () => {
  await sleep(500);
  return courses;
};