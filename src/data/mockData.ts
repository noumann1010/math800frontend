import type { BlogPost, ChoiceKey, Course, LessonItem, Plan, Question, Testimonial } from '../types';

export const heroStats = [
  { label: 'Students Coached', value: '15K+' },
  { label: 'Improvement Rate', value: '100%' },
  { label: 'Daily Questions', value: '300+' },
  { label: 'Expert Coaches', value: '34' },
];

export const featureCards = [
  {
    title: 'Unique Lessons',
    description:
      'Master official SAT math patterns through breakdowns that teach logic, shortcuts, and test-taking strategy.',
    icon: 'U',
  },
  {
    title: 'Adaptive Learning',
    description:
      'Our diagnostics engine identifies your exact weak skills and updates your practice plan after every session.',
    icon: 'A',
  },
  {
    title: 'Performance Tracking',
    description:
      'Follow your score trend with clean analytics, concept-level confidence, and weekly progression reports.',
    icon: 'P',
  },
];

export const categories = [
  'All',
  'Algebra',
] as const;

export const PRIMARY_COURSE_ID = 'sat-mastery-bootcamp';

const allCourses: Course[] = [
  {
    id: 'sat-mastery-bootcamp',
    title: 'SAT Math Mastery Bootcamp',
    description:
      'A complete roadmap from diagnostics to targeted drills and timed mock exams for students aiming 700+.',
    category: 'Algebra',
    duration: '3 Months',
    lessons: 32,
    price: 80,
    oldPrice: 100,
    level: 'Intermediate',
    rating: 4.9,
    instructor: 'Lina Hassan',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    tags: ['Most popular', 'Official SAT style'],
  },
  {
    id: 'algebra-acceleration',
    title: 'Algebra Acceleration',
    description:
      'Fix the highest-impact algebra gaps fast with focused drills on functions, equations, and system solving.',
    category: 'Algebra',
    duration: '8 Weeks',
    lessons: 18,
    price: 49,
    oldPrice: 69,
    level: 'Beginner',
    rating: 4.7,
    instructor: 'Noah Kim',
    image:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Score jump plan'],
  },
  {
    id: 'advanced-math-protocol',
    title: 'Advanced Math Protocol',
    description:
      'Deep practice on quadratic models, exponentials, polynomials, and nonlinear systems with guided reasoning.',
    category: 'Advanced Math',
    duration: '10 Weeks',
    lessons: 24,
    price: 74,
    oldPrice: 99,
    level: 'Advanced',
    rating: 4.8,
    instructor: 'Arjun Patel',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hardest question bank'],
  },
  {
    id: 'data-analysis-tactics',
    title: 'Data Analysis Tactics',
    description:
      'Master tables, percentages, and chart interpretation with exam-speed workflows and confidence checks.',
    category: 'Data Analysis',
    duration: '6 Weeks',
    lessons: 14,
    price: 42,
    oldPrice: 56,
    level: 'Intermediate',
    rating: 4.6,
    instructor: 'Maya Brooks',
    image:
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    tags: ['Fast interpretation'],
  },
  {
    id: 'geometry-trig-command',
    title: 'Geometry + Trig Command',
    description:
      'Visual techniques to solve area, angle, triangle, and circle questions under strict SAT timing.',
    category: 'Geometry',
    duration: '7 Weeks',
    lessons: 17,
    price: 46,
    oldPrice: 62,
    level: 'Intermediate',
    rating: 4.7,
    instructor: 'Sophia Nguyen',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Visual learning'],
  },
  {
    id: 'trigonometry-finalsprint',
    title: 'Trigonometry Final Sprint',
    description:
      'A short intensive to lock down unit circle, identities, and graph interpretation before test day.',
    category: 'Trigonometry',
    duration: '4 Weeks',
    lessons: 10,
    price: 36,
    oldPrice: 50,
    level: 'Advanced',
    rating: 4.5,
    instructor: 'Daniel Ross',
    image:
      'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=1200&q=80',
    tags: ['Quick boost'],
  },
];

export const courses: Course[] = allCourses.filter((course) => course.id === PRIMARY_COURSE_ID);

export const blogPosts: BlogPost[] = [
  {
    id: 'adaptive-learning-future',
    title: 'Why Adaptive Learning Is the Future of SAT Math Prep',
    excerpt:
      'How AI diagnostics and concept-level feedback reduce wasted study hours and accelerate score growth.',
    content:
      'Math800 continuously adapts each student\'s plan based on real performance. Instead of static worksheets, students get precision practice mapped to missed concepts and timing patterns. Every question attempt updates confidence by concept, difficulty, and speed. This enables a feedback loop where students spend less time reviewing what they already know and more time mastering what actually appears on the SAT.',
    image:
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1400&q=80',
    author: 'Nouman Ali',
    tag: 'Inspiration',
    createdAt: '2026-03-01',
    readTime: '6 min',
  },
  {
    id: 'reading-the-sat-question',
    title: 'How to Read SAT Math Questions Without Getting Tricked',
    excerpt:
      'A three-step scanning method to avoid common distractors and hidden constraints.',
    content:
      'Top scorers read SAT questions in layers: objective, constraints, and answer format. This approach catches unit mismatches, overcounting traps, and negative sign errors before they happen. Practicing this method under timed sets builds accuracy and pace together.',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80',
    author: 'Lina Hassan',
    tag: 'Strategy',
    createdAt: '2026-02-20',
    readTime: '4 min',
  },
  {
    id: 'weekly-score-routine',
    title: 'The Weekly Routine That Adds 70+ SAT Math Points',
    excerpt:
      'A realistic routine that combines timed blocks, revision loops, and diagnostics.',
    content:
      'Consistent improvement comes from a simple cycle: 2 timed sessions, 2 concept drills, and 1 review day. The review day is where score gains happen, because students transform mistakes into repeatable strategy. Use error tags such as algebra setup, careless arithmetic, and over-time management to target fixes.',
    image:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80',
    author: 'Maya Brooks',
    tag: 'Growth',
    createdAt: '2026-02-11',
    readTime: '5 min',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Savannah Nguyen',
    role: 'Class of 2027',
    quote:
      'I moved from 610 to 760 because the practice was targeted exactly to my weak concepts.',
    avatar:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    score: 5,
  },
  {
    id: 't-2',
    name: 'Aamir Khan',
    role: 'Class of 2026',
    quote:
      'The dashboard made my progress obvious. I knew what to study every day without guessing.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    score: 5,
  },
  {
    id: 't-3',
    name: 'Emma Carter',
    role: 'Parent',
    quote:
      'The structure is better than private tutoring because feedback is immediate and measurable.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    score: 5,
  },
];

export const pricingPlans: Plan[] = [
  {
    id: 'starter-beta',
    name: 'Starter Beta',
    description: 'Great for new students',
    price: 0,
    billing: 'Beta',
    cta: 'Start beta',
    perks: ['Diagnostics intro', '5 adaptive sets', 'Progress snapshot'],
  },
  {
    id: 'full-beta',
    name: 'Full Beta Access',
    description: 'Most popular while in beta',
    price: 0,
    billing: 'Beta',
    featured: true,
    cta: 'Join full beta',
    perks: ['Unlimited sets', 'Weekly analytics', 'Practice streak rewards'],
  },
  {
    id: 'coach-beta',
    name: 'Coach Beta',
    description: 'For mentors and school support',
    price: 0,
    billing: 'Beta',
    cta: 'Request coach beta',
    perks: ['Admin dashboard', 'Group assignments', 'Dedicated support'],
  },
];

export const faqItems = [
  {
    question: 'How does Math800 personalize study plans?',
    answer:
      'We analyze accuracy, timing, and concept coverage after each question and adapt your next practice set in real time.',
  },
  {
    question: 'Can I connect this to my school tutor workflow?',
    answer:
      'Yes. Coaches can review progress reports, assign practice bundles, and track class-level performance.',
  },
  {
    question: 'What SAT sections are currently covered?',
    answer:
      'Math800 focuses on SAT Math domains including Algebra, Advanced Math, Problem Solving, and Data Analysis.',
  },
  {
    question: 'Do you support API integration for backend systems?',
    answer:
      'Yes. This frontend ships with an API layer using `VITE_API_BASE_URL` and typed service functions for easy backend linking.',
  },
];

export const lessonList: LessonItem[] = Array.from({ length: 14 }, (_, index) => ({
  id: `lesson-${index + 1}`,
  title: `Lesson 0${(index % 4) + 1}: SAT Math Focus Session`,
  duration: `${25 + (index % 4) * 5} mins`,
}));

export const calendarSlots = [
  { time: '2 PM', task: 'Live SAT Math Drill', active: true },
  { time: '3 PM', task: '', active: false },
  { time: '4 PM', task: '', active: false },
  { time: '5 PM', task: '', active: false },
  { time: '6 PM', task: '', active: false },
];

export const mockQuestions: Question[] = [
  {
    id: 101,
    prompt: 'If 2x + 5 = 17, what is the value of x?',
    choices: { A: '4', B: '5', C: '6', D: '7' },
    difficulty: 1,
    skill_ids: [11],
  },
  {
    id: 102,
    prompt: 'What is the y-intercept of y = 3x - 9?',
    choices: { A: '-9', B: '-3', C: '0', D: '3' },
    difficulty: 1,
    skill_ids: [11, 15],
  },
  {
    id: 103,
    prompt: 'A triangle has side lengths 3, 4, and 5. What is its area?',
    choices: { A: '6', B: '8', C: '10', D: '12' },
    difficulty: 2,
    skill_ids: [21],
  },
  {
    id: 104,
    prompt: 'If f(x) = x² - 4x + 4, what is f(6)?',
    choices: { A: '4', B: '8', C: '12', D: '16' },
    difficulty: 2,
    skill_ids: [12, 13],
  },
  {
    id: 105,
    prompt: 'The average of 10, 14, and n is 12. What is n?',
    choices: { A: '8', B: '10', C: '12', D: '14' },
    difficulty: 2,
    skill_ids: [31],
  },
  {
    id: 106,
    prompt: 'Solve for x: 3(x - 2) = 2x + 7',
    choices: { A: '7', B: '9', C: '11', D: '13' },
    difficulty: 2,
    skill_ids: [11],
  },
  {
    id: 107,
    prompt: 'If the slope of a line is -2 and it passes through (0, 5), what is the equation?',
    choices: { A: 'y = 2x + 5', B: 'y = -2x + 5', C: 'y = -2x - 5', D: 'y = 5x - 2' },
    difficulty: 3,
    skill_ids: [15],
  },
  {
    id: 108,
    prompt: 'What is 25% of 240?',
    choices: { A: '40', B: '50', C: '60', D: '75' },
    difficulty: 1,
    skill_ids: [31],
  },
  {
    id: 109,
    prompt: 'If x² = 49 and x > 0, what is x?',
    choices: { A: '5', B: '6', C: '7', D: '8' },
    difficulty: 1,
    skill_ids: [12],
  },
  {
    id: 110,
    prompt: 'In a right triangle, one leg is 6 and the hypotenuse is 10. What is the other leg?',
    choices: { A: '6', B: '7', C: '8', D: '9' },
    difficulty: 2,
    skill_ids: [21],
  },
];

const mockCorrectChoiceByQuestionId: Record<number, ChoiceKey> = {
  101: 'C',
  102: 'A',
  103: 'A',
  104: 'D',
  105: 'C',
  106: 'D',
  107: 'B',
  108: 'C',
  109: 'C',
  110: 'C',
};

export function getMockCorrectChoice(questionId: number): ChoiceKey {
  return mockCorrectChoiceByQuestionId[questionId] ?? 'A';
}
