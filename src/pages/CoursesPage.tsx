import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import { FadeIn } from '../components/FadeIn';
import { categories, courses as localCourses } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { Course } from '../types';

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState(searchParams.get('query') ?? '');
  const [courseItems, setCourseItems] = useState<Course[]>(localCourses);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notify, setSelectedCourse } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await api.getCourses();
        if (isMounted) {
          setCourseItems(response.data);
        }
      } catch {
        if (isMounted) {
          setCourseItems(localCourses);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courseItems.filter((course) => {
      const categoryMatch = category === 'All' ? true : course.category === category;
      const queryMatch = `${course.title} ${course.description} ${course.tags.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return categoryMatch && queryMatch;
    });
  }, [category, courseItems, query]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.trim()) {
      setSearchParams({ query: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main>
      <section className="section section--muted">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">Search your favorite course</p>
            <h1>Find SAT Math training built for your target score</h1>
            <form className="course-search" onSubmit={handleSearch}>
              <input
                placeholder="Search subject"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="btn btn--solid" type="submit">
                Search
              </button>
            </form>
          </FadeIn>

          <div className="filter-chips">
            {categories.map((chip) => (
              <button
                key={chip}
                className={chip === category ? 'chip chip--active' : 'chip'}
                onClick={() => setCategory(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{loading ? 'Loading courses...' : `${filteredCourses.length} courses found`}</h2>
            <button className="btn btn--ghost" onClick={() => navigate('/pricing')}>
              Beta Access Info
            </button>
          </div>

          <div className="course-grid course-grid--four">
            {filteredCourses.map((course, index) => (
              <FadeIn key={course.id} delay={index * 0.05}>
                <CourseCard
                  course={course}
                  primaryLabel="Enter Course"
                  onPrimaryAction={(selected) => {
                    setSelectedCourse(selected);
                    notify(`Entering ${selected.title}`, 'success');
                    navigate(`/courses/${selected.id}`);
                  }}
                />
              </FadeIn>
            ))}
          </div>

          {!filteredCourses.length && !loading ? (
            <p className="empty-state">No courses matched your filters. Try another keyword.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
