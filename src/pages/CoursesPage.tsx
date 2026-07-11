import { Navigate } from 'react-router-dom';
import { PRIMARY_COURSE_ID } from '../data/mockData';

// The whole app is a single course (the SAT Math Mastery Bootcamp), so there is
// no course catalog to browse or "enter" — navigating to /courses drops the
// learner straight into the bootcamp workspace.
export function CoursesPage() {
  return <Navigate to={`/courses/${PRIMARY_COURSE_ID}`} replace />;
}
