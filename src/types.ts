export type CourseCategory =
  | 'Algebra'
  | 'Advanced Math'
  | 'Data Analysis'
  | 'Geometry'
  | 'Trigonometry';

export type Course = {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  duration: string;
  lessons: number;
  price: number;
  oldPrice: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  instructor: string;
  image: string;
  tags: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tag: string;
  createdAt: string;
  readTime: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  score: number;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: string;
  featured?: boolean;
  cta: string;
  perks: string[];
};

export type LessonItem = {
  id: string;
  title: string;
  duration: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type NewsletterPayload = {
  email: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type CheckoutPayload = {
  courseId: string;
  cardName: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ChoiceKey = 'A' | 'B' | 'C' | 'D';

export type PracticeQuestion = {
  id: number;
  prompt: string;
  choices: Record<ChoiceKey, string>;
  difficulty: number;
  skill_ids: number[];
};

export type QuestionId = number;
export type Question = PracticeQuestion;

export type AdaptiveNextResponse = {
  question: PracticeQuestion | null;
  target_difficulty: number;
  target_skill_id: number | null;
  exhausted: boolean;
};

export type AttemptResult = {
  attempt_id: number;
  is_correct: boolean;
  correct_choice: ChoiceKey;
  explanation: string;
};

export type TestSessionQuestion = {
  order_index: number;
  id: number;
  question_id: number;
  prompt: string;
  choices: Record<ChoiceKey, string>;
  difficulty: number;
  skill_ids: number[];
};

export type TestSession = {
  id: number;
  status: 'in_progress' | 'completed' | string;
  questions: TestSessionQuestion[];
};

export type SubmitTestAnswer = {
  id: number;
  chosen_choice: ChoiceKey;
};

export type SubmitTestPayload = {
  answers: SubmitTestAnswer[];
};

export type SubmitTestResponse = {
  total: number;
  correct: number;
  accuracy: number;
  breakdown_by_skill: Record<string, { attempted: number; correct: number; accuracy: number }>;
};

export type AnalyticsPoint = {
  date: string;
  value: number;
};

export type SkillMasteryItem = {
  skill_id: number;
  skill_name: string;
  domain: string;
  mastery: number;
  recent_accuracy: number;
};

export type AnalyticsOverview = {
  accuracy_series: AnalyticsPoint[];
  avg_time_series: AnalyticsPoint[];
  mastery_by_skill: SkillMasteryItem[];
  weak_skills: SkillMasteryItem[];
};

export type RecommendationItem = {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  reason: string;
};

export type Lesson = {
  id: number;
  skill_id: number;
  title: string;
  content: string;
  difficulty_level: number;
};
