import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Course } from '../types';

type CourseCardProps = {
  course: Course;
  onPrimaryAction?: (course: Course) => void;
  primaryLabel?: string;
};

export function CourseCard({
  course,
  onPrimaryAction,
  primaryLabel = 'View Course',
}: CourseCardProps) {
  return (
    <motion.article className="course-card" whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <Link to={`/courses/${course.id}`} className="course-card__media-link">
        <img src={course.image} alt={course.title} />
      </Link>
      <div className="course-card__body">
        <p className="course-card__meta">
          {course.category} | {course.duration}
        </p>
        <h3>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
        </h3>
        <p>{course.description}</p>
        <div className="course-card__instructor">
          <span>{course.instructor}</span>
          <span className="beta-chip">Beta: Free Temporarily</span>
        </div>
        <div className="course-card__actions">
          <Link to={`/courses/${course.id}`} className="btn btn--ghost">
            Enter
          </Link>
          <button className="btn btn--solid" onClick={() => onPrimaryAction?.(course)}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
