import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courses as localCourses } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { Course } from '../types';

type CourseLesson = {
  id: string;
  title: string;
  duration: string;
  focus: string;
  summary: string;
};

type CourseUnit = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

function buildCourseUnits(courseId: string): CourseUnit[] {
  return [
    {
      id: `${courseId}-unit-1`,
      title: 'Unit 01: Core Algebra Foundations',
      lessons: [
        {
          id: `${courseId}-u1-l1`,
          title: 'Linear Equations Bootcamp',
          duration: '30 mins',
          focus: 'Solve one-variable equations quickly and accurately.',
          summary:
            'Covers inverse operations, multi-step equations, and error traps under timed conditions.',
        },
        {
          id: `${courseId}-u1-l2`,
          title: 'Inequalities and Number Lines',
          duration: '28 mins',
          focus: 'Translate and graph inequalities the SAT way.',
          summary: 'Includes compound inequality patterns and interval notation fluency.',
        },
        {
          id: `${courseId}-u1-l3`,
          title: 'Practice Quiz: Algebra Core',
          duration: '25 mins',
          focus: 'Mixed algebra questions with speed checkpoints.',
          summary: 'A focused checkpoint before moving to advanced topics.',
        },
      ],
    },
    {
      id: `${courseId}-unit-2`,
      title: 'Unit 02: Functions and Modeling',
      lessons: [
        {
          id: `${courseId}-u2-l1`,
          title: 'Function Notation Mastery',
          duration: '32 mins',
          focus: 'Interpret and evaluate function expressions confidently.',
          summary:
            'Builds fast recognition for function notation, domain restrictions, and substitutions.',
        },
        {
          id: `${courseId}-u2-l2`,
          title: 'Graph Features and Transformations',
          duration: '34 mins',
          focus: 'Read slopes, intercepts, minima, and maxima from graphs.',
          summary:
            'Teaches visual parsing of SAT graph questions and elimination shortcuts.',
        },
        {
          id: `${courseId}-u2-l3`,
          title: 'Practice Quiz: Functions',
          duration: '24 mins',
          focus: 'Apply graph and function logic in timed sets.',
          summary: 'Targets common SAT distractors and interpretation errors.',
        },
      ],
    },
    {
      id: `${courseId}-unit-3`,
      title: 'Unit 03: Advanced Math and Problem Solving',
      lessons: [
        {
          id: `${courseId}-u3-l1`,
          title: 'Quadratics and Factoring',
          duration: '35 mins',
          focus: 'Identify fastest pathways to roots and vertex form.',
          summary:
            'Combines algebraic manipulation with graph interpretation for higher-difficulty items.',
        },
        {
          id: `${courseId}-u3-l2`,
          title: 'Systems of Equations',
          duration: '31 mins',
          focus: 'Choose between substitution, elimination, and graphing.',
          summary: 'Decision-tree approach to optimize speed on systems questions.',
        },
        {
          id: `${courseId}-u3-l3`,
          title: 'Practice Quiz: Advanced Mix',
          duration: '26 mins',
          focus: 'Mixed medium-hard SAT style questions.',
          summary: 'Reinforces pacing and precision before full tests.',
        },
      ],
    },
    {
      id: `${courseId}-unit-4`,
      title: 'Unit 04: Timed Strategy and Exam Readiness',
      lessons: [
        {
          id: `${courseId}-u4-l1`,
          title: 'Timing, Pacing, and Guess Strategy',
          duration: '22 mins',
          focus: 'Allocate time per question type and difficulty.',
          summary: 'Covers strategic skipping, return ordering, and confidence tracking.',
        },
        {
          id: `${courseId}-u4-l2`,
          title: 'Error Log and Review Loop',
          duration: '20 mins',
          focus: 'Turn mistakes into repeatable score gains.',
          summary: 'Build a weekly review loop that targets concept and timing gaps.',
        },
        {
          id: `${courseId}-u4-l3`,
          title: 'Capstone Quiz: SAT Mastery',
          duration: '30 mins',
          focus: 'Final checkpoint before full-length testing.',
          summary: 'Simulates pressure and verifies readiness for 22-question full test mode.',
        },
      ],
    },
  ];
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(
    localCourses.find((item) => item.id === courseId) ?? null,
  );
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const navigate = useNavigate();
  const { notify, setSelectedCourse } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      if (!courseId) {
        return;
      }

      try {
        const response = await api.getCourseById(courseId);
        if (isMounted && response.data) {
          setCourse(response.data);
        }
      } catch {
        // keep local fallback
      }
    };

    void loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const courseUnits = useMemo(() => {
    if (!course) {
      return [];
    }

    return buildCourseUnits(course.id);
  }, [course]);

  const lessons = useMemo(
    () =>
      courseUnits.flatMap((unit, unitIndex) =>
        unit.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          unitTitle: unit.title,
          unitIndex,
          lessonIndex,
        })),
      ),
    [courseUnits],
  );

  const activeLessonId = selectedLessonId || lessons[0]?.id || '';

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0] ?? null,
    [activeLessonId, lessons],
  );

  const practiceQuizLessons = useMemo(
    () =>
      lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes('practice quiz') ||
          lesson.title.toLowerCase().includes('capstone'),
      ),
    [lessons],
  );

  if (!course) {
    return (
      <main className="section">
        <div className="container empty-state">
          <h1>Course not found</h1>
          <button className="btn btn--solid" onClick={() => navigate('/courses')}>
            Back to courses
          </button>
        </div>
      </main>
    );
  }

  const openPracticeSet = () => {
    setSelectedCourse(course);
    notify('Opening a 10-question practice set', 'success');
    navigate('/practice');
  };

  const openFullTest = () => {
    setSelectedCourse(course);
    notify('Opening full test mode (22 questions)', 'success');
    navigate('/full-test');
  };

  return (
    <main className="course-learning-page">
      <div className="container course-learning-shell">
        <aside className="course-learning-sidebar">
          <div className="course-learning-sidebar-head">
            <p className="eyebrow">Course Workspace</p>
            <h2>{course.title}</h2>
            <p>{course.lessons} guided modules and quizzes</p>
          </div>

          <p className="course-sidebar-section-title">Units and Lessons</p>
          <div className="course-unit-list">
            {courseUnits.map((unit, unitIndex) => (
              <section className="course-unit-group" key={unit.id}>
                <h3>
                  Unit {String(unitIndex + 1).padStart(2, '0')}
                  <span>{unit.title.replace(/^Unit \d+: /, '')}</span>
                </h3>
                {unit.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lesson.id}
                    className={
                      activeLessonId === lesson.id
                        ? 'course-lesson-chip course-lesson-chip--active'
                        : 'course-lesson-chip'
                    }
                    onClick={() => setSelectedLessonId(lesson.id)}
                  >
                    <strong>
                      L{unitIndex + 1}.{lessonIndex + 1}
                    </strong>
                    <span>{lesson.title}</span>
                    <small>{lesson.duration}</small>
                  </button>
                ))}
              </section>
            ))}
          </div>

          <p className="course-sidebar-section-title">Practice Quiz</p>
          <div className="course-quiz-list">
            {practiceQuizLessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={
                  activeLessonId === lesson.id ? 'course-quiz-chip course-quiz-chip--active' : 'course-quiz-chip'
                }
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <span>{lesson.title}</span>
                <small>{lesson.duration}</small>
                <em className={`dot dot-${index % 3}`} />
              </button>
            ))}
          </div>

          <div className="course-sidebar-actions">
            <button className="btn btn--solid" onClick={openPracticeSet}>
              Practice Set
            </button>
            <button className="btn btn--ghost" onClick={openFullTest}>
              Full Test
            </button>
          </div>
        </aside>

        <section className="course-learning-main">
          <header className="course-learning-head">
            <div>
              <p className="eyebrow">Current Lesson</p>
              <h1>{selectedLesson?.title ?? 'Lesson Overview'}</h1>
              <p>{selectedLesson?.unitTitle ?? 'SAT Math Mastery'}</p>
            </div>
            <div className="course-head-actions">
              <button className="btn btn--solid" onClick={openPracticeSet}>
                Generate Practice Set
              </button>
              <button className="btn btn--ghost" onClick={openFullTest}>
                Generate Full Test
              </button>
            </div>
          </header>

          <article className="course-learning-panel">
            <img src={course.image} alt={course.title} className="course-learning-image" />
            <div className="video-progress">
              <span>{selectedLesson?.duration ?? '30 mins'}</span>
              <div className="progress-line">
                <span />
              </div>
              <span>In Progress</span>
            </div>

            <h2>{selectedLesson?.focus ?? 'SAT Math focus training'}</h2>
            <p>{selectedLesson?.summary ?? course.description}</p>

            <div className="course-learning-meta">
              <span>Instructor: {course.instructor}</span>
              <span>Level: {course.level}</span>
              <span>Rating: {course.rating.toFixed(1)}</span>
              <span>Beta Access: Free Temporarily</span>
            </div>

            <div className="course-learning-content-grid">
              <section className="content-card">
                <h3>What you will master</h3>
                <ul>
                  <li>Question setup patterns used on official SAT math sections.</li>
                  <li>Step-by-step solving workflows for medium and hard items.</li>
                  <li>Timing strategies to maximize score under pressure.</li>
                </ul>
              </section>

              <section className="content-card">
                <h3>Recommended next actions</h3>
                <ul>
                  <li>Run a practice set after each unit to lock in retention.</li>
                  <li>Take full test mode weekly to benchmark progress.</li>
                  <li>Review explanations and missed-skill tags after every attempt.</li>
                </ul>
              </section>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
