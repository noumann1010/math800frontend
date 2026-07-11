import {
  blogPosts,
  courses,
  PRIMARY_COURSE_ID,
  pricingPlans,
} from '../data/mockData';
import type {
  AdaptiveNextResponse,
  AnalyticsOverview,
  ApiResponse,
  AttemptResult,
  BlogPost,
  CheckoutPayload,
  ChoiceKey,
  ContactPayload,
  Course,
  Lesson,
  NewsletterPayload,
  Plan,
  PracticeQuestion,
  RecommendationItem,
  SubmitTestPayload,
  SubmitTestResponse,
  TestSession,
  TestSessionQuestion,
} from '../types';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function shouldUseVercelProxy(rawBaseUrl: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';

  return !isLocalHost && rawBaseUrl.includes('.onrender.com');
}

function resolveApiBaseUrl(): string {
  if (!RAW_API_BASE_URL) {
    return '';
  }

  if (shouldUseVercelProxy(RAW_API_BASE_URL)) {
    return '/api-proxy/api/v1';
  }

  const trimmed = trimTrailingSlash(RAW_API_BASE_URL);
  if (trimmed.endsWith('/api/v1')) {
    return trimmed;
  }

  return `${trimmed}/api/v1`;
}

const API_BASE_URL = resolveApiBaseUrl();
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type RequestOptions = RequestInit & {
  firebaseIdToken?: string;
};

const CHOICE_KEYS: ChoiceKey[] = ['A', 'B', 'C', 'D'];
const INLINE_OPTION_PATTERN =
  /(?:^|\n)\s*([A-D])\s*[\.\):]\s*(.+?)(?=(?:\n\s*[A-D]\s*[\.\):]\s*)|$)/gis;
const FIRST_OPTION_SPLIT = /\n\s*[A-D]\s*[\.\):]\s*/i;
const QUESTION_ID_TRAILING_DIGITS = /(\d+)\s*$/;

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('No API base URL configured');
  }

  const { firebaseIdToken, headers, ...rest } = options;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(firebaseIdToken ? { Authorization: `Bearer ${firebaseIdToken}` } : {}),
      ...(headers ?? {}),
    },
    ...rest,
  });

  if (!response.ok) {
    let detail = '';
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      try {
        const payload = (await response.json()) as { detail?: string; message?: string };
        detail = payload.detail ?? payload.message ?? '';
      } catch {
        detail = '';
      }
    } else {
      detail = await response.text();
    }

    const defaultMessageByStatus: Record<number, string> = {
      400: 'Bad request. Please verify your input.',
      401: 'Unauthorized. Please sign in again.',
      404: 'Resource not found.',
      422: 'Validation failed. Please review the request.',
    };

    const baseMessage =
      defaultMessageByStatus[response.status] ?? `Request failed (${response.status}).`;
    throw new Error(detail || baseMessage);
  }

  return (await response.json()) as T;
}

async function withMockFallback<T>(
  callback: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  try {
    return await callback();
  } catch {
    return fallback();
  }
}

function requireToken(firebaseIdToken: string | null | undefined): string {
  if (!firebaseIdToken?.trim()) {
    throw new Error('Missing authentication session. Please sign in again.');
  }

  return firebaseIdToken;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function cleanText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function compactText(value: unknown): string {
  return cleanText(value).split(/\s+/).join(' ').trim();
}

function toFiniteNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractInlineOptions(questionMarkdown: string): Partial<Record<ChoiceKey, string>> {
  const next: Partial<Record<ChoiceKey, string>> = {};
  let match: RegExpExecArray | null = null;

  INLINE_OPTION_PATTERN.lastIndex = 0;
  while ((match = INLINE_OPTION_PATTERN.exec(questionMarkdown)) !== null) {
    const key = (match[1] || '').toUpperCase() as ChoiceKey;
    if (!CHOICE_KEYS.includes(key)) {
      continue;
    }

    const value = compactText(match[2] || '');
    if (value && !next[key]) {
      next[key] = value;
    }
  }

  return next;
}

function splitPromptFromInlineOptions(questionMarkdown: string): string {
  const parts = questionMarkdown.split(FIRST_OPTION_SPLIT);
  return cleanText(parts[0] || questionMarkdown);
}

function getRawChoiceValue(raw: Record<string, unknown>, key: ChoiceKey): string {
  const direct = cleanText(raw[key]);
  if (direct) {
    return direct;
  }

  const lower = cleanText(raw[key.toLowerCase()]);
  if (lower) {
    return lower;
  }

  return cleanText(raw[`choice_${key.toLowerCase()}_markdown`]);
}

function normalizeChoicesFromRawQuestion(rawQuestion: Record<string, unknown>): Record<ChoiceKey, string> | null {
  const next: Partial<Record<ChoiceKey, string>> = {};
  const sourceChoices = isRecord(rawQuestion.choices) ? rawQuestion.choices : null;

  for (const key of CHOICE_KEYS) {
    const structured = sourceChoices ? cleanText(sourceChoices[key] ?? sourceChoices[key.toLowerCase()]) : '';
    if (structured) {
      next[key] = structured;
      continue;
    }

    next[key] = getRawChoiceValue(rawQuestion, key);
  }

  const questionMarkdown = cleanText(rawQuestion.question_markdown);
  if (questionMarkdown) {
    const inlineChoices = extractInlineOptions(questionMarkdown);
    for (const key of CHOICE_KEYS) {
      if (!next[key]) {
        next[key] = inlineChoices[key] || '';
      }
    }
  }

  if (!next.A || !next.B || !next.C || !next.D) {
    return null;
  }

  return next as Record<ChoiceKey, string>;
}

function toStableIdFromString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash || 1;
}

function normalizeQuestionId(rawQuestion: Record<string, unknown>, prompt: string): number {
  const candidate = rawQuestion.id ?? rawQuestion.question_id;
  const numeric = toFiniteNumber(candidate, Number.NaN);
  if (Number.isFinite(numeric)) {
    return numeric;
  }

  const textId = compactText(candidate);
  if (textId) {
    const trailingDigitsMatch = textId.match(QUESTION_ID_TRAILING_DIGITS);
    if (trailingDigitsMatch?.[1]) {
      const trailing = Number(trailingDigitsMatch[1]);
      if (Number.isFinite(trailing)) {
        return trailing;
      }
    }
  }

  return toStableIdFromString(prompt || 'math800-question');
}

function normalizePracticeQuestion(value: unknown): PracticeQuestion | null {
  if (!isRecord(value)) {
    return null;
  }

  const promptMarkdown = cleanText(value.question_markdown);
  const promptBase = cleanText(value.prompt) || promptMarkdown || cleanText(value.question_text);
  const choices = normalizeChoicesFromRawQuestion(value);
  if (!choices) {
    return null;
  }

  const inlineChoices = extractInlineOptions(promptBase);
  const prompt = Object.keys(inlineChoices).length > 0 ? splitPromptFromInlineOptions(promptBase) : promptBase;
  if (!prompt) {
    return null;
  }

  const skillIdsRaw = value.skill_ids;
  const skill_ids = Array.isArray(skillIdsRaw)
    ? skillIdsRaw
        .map((entry) => toFiniteNumber(entry, Number.NaN))
        .filter((entry): entry is number => Number.isFinite(entry))
    : typeof skillIdsRaw === 'string'
      ? skillIdsRaw
          .split(',')
          .map((entry) => toFiniteNumber(entry.trim(), Number.NaN))
          .filter((entry): entry is number => Number.isFinite(entry))
      : [];

  return {
    id: normalizeQuestionId(value, prompt),
    prompt,
    choices,
    difficulty: toFiniteNumber(value.difficulty, 3),
    skill_ids,
  };
}

function normalizeSessionQuestions(rawQuestions: unknown): TestSessionQuestion[] {
  if (!Array.isArray(rawQuestions)) {
    return [];
  }

  return rawQuestions
    .map((entry, index) => {
      if (isRecord(entry) && 'question' in entry) {
        const question = normalizePracticeQuestion(entry.question);
        if (!question) {
          return null;
        }

        const canonicalId = toFiniteNumber(entry.id ?? entry.question_id ?? question.id, question.id);
        const questionId = toFiniteNumber(entry.question_id ?? entry.id ?? question.id, canonicalId);

        return {
          order_index: toFiniteNumber(entry.order_index, index),
          id: canonicalId,
          question_id: questionId,
          prompt: question.prompt,
          choices: question.choices,
          difficulty: question.difficulty,
          skill_ids: question.skill_ids,
        };
      }

      const question = normalizePracticeQuestion(entry);
      if (!question) {
        return null;
      }

      const orderIndex =
        isRecord(entry) && 'order_index' in entry ? toFiniteNumber(entry.order_index, index) : index;
      const canonicalId = isRecord(entry)
        ? toFiniteNumber(entry.id ?? entry.question_id ?? question.id, question.id)
        : question.id;
      const questionId = isRecord(entry)
        ? toFiniteNumber(entry.question_id ?? entry.id ?? question.id, canonicalId)
        : question.id;

      return {
        order_index: orderIndex,
        id: canonicalId,
        question_id: questionId,
        prompt: question.prompt,
        choices: question.choices,
        difficulty: question.difficulty,
        skill_ids: question.skill_ids,
      };
    })
    .filter((item): item is TestSessionQuestion => item !== null)
    .sort((a, b) => a.order_index - b.order_index);
}

function normalizeQuestionSetPayload(payload: unknown): PracticeQuestion[] {
  if (Array.isArray(payload)) {
    return payload
      .map((entry) => normalizePracticeQuestion(entry))
      .filter((entry): entry is PracticeQuestion => entry !== null);
  }

  if (isRecord(payload)) {
    const source = payload as {
      questions?: unknown;
      data?: unknown;
    };

    if (Array.isArray(source.questions)) {
      return source.questions
        .map((entry) => normalizePracticeQuestion(entry))
        .filter((entry): entry is PracticeQuestion => entry !== null);
    }

    if (Array.isArray(source.data)) {
      return source.data
        .map((entry) => normalizePracticeQuestion(entry))
        .filter((entry): entry is PracticeQuestion => entry !== null);
    }

    if (isRecord(source.data) && Array.isArray(source.data.questions)) {
      return source.data.questions
        .map((entry) => normalizePracticeQuestion(entry))
        .filter((entry): entry is PracticeQuestion => entry !== null);
    }
  }

  return [];
}

function normalizeTestSessionPayload(payload: unknown): TestSession {
  if (isRecord(payload)) {
    const source = payload as {
      session_id?: unknown;
      id?: unknown;
      status?: unknown;
      questions?: unknown;
      data?: unknown;
    };
    const session = isRecord(source.data) ? source.data : source;

    return {
      id: toFiniteNumber(session.id ?? session.session_id ?? source.id ?? source.session_id, 0),
      status: compactText(session.status ?? source.status) || 'in_progress',
      questions: normalizeSessionQuestions(session.questions ?? source.questions ?? []),
    };
  }

  return { id: 0, status: 'in_progress', questions: [] };
}

function normalizeChoice(value: unknown): ChoiceKey {
  const normalized = compactText(value).toUpperCase();
  return CHOICE_KEYS.includes(normalized as ChoiceKey) ? (normalized as ChoiceKey) : 'A';
}

function normalizeAttemptResult(payload: unknown): AttemptResult {
  const source =
    isRecord(payload) && 'data' in payload && isRecord(payload.data)
      ? payload.data
      : isRecord(payload)
        ? payload
        : {};

  return {
    attempt_id: toFiniteNumber(source.attempt_id, 0),
    is_correct: Boolean(source.is_correct),
    correct_choice: normalizeChoice(source.correct_choice),
    explanation: cleanText(source.explanation),
  };
}

function normalizeSubmitTestResponse(payload: unknown): SubmitTestResponse {
  const source =
    isRecord(payload) && 'data' in payload && isRecord(payload.data)
      ? payload.data
      : isRecord(payload)
        ? payload
        : {};

  const breakdownSource = isRecord(source.breakdown_by_skill) ? source.breakdown_by_skill : {};
  const breakdown: SubmitTestResponse['breakdown_by_skill'] = {};

  for (const [skillId, item] of Object.entries(breakdownSource)) {
    if (!isRecord(item)) {
      continue;
    }

    breakdown[skillId] = {
      attempted: toFiniteNumber(item.attempted, 0),
      correct: toFiniteNumber(item.correct, 0),
      accuracy: toFiniteNumber(item.accuracy, 0),
    };
  }

  return {
    total: toFiniteNumber(source.total, 0),
    correct: toFiniteNumber(source.correct, 0),
    accuracy: toFiniteNumber(source.accuracy, 0),
    breakdown_by_skill: breakdown,
  };
}

export const api = {
  async firebaseLogin(firebaseIdToken: string): Promise<{ id: number; email: string; firebase_uid: string }> {
    const idToken = requireToken(firebaseIdToken);

    return request<{ id: number; email: string; firebase_uid: string }>('/auth/firebase-login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  async getPracticeSet(
    firebaseIdToken: string,
    count = 10,
    skills?: number[],
  ): Promise<PracticeQuestion[]> {
    const token = requireToken(firebaseIdToken);
    const nextCount = Math.min(50, Math.max(1, Math.trunc(count || 10)));
    const params = new URLSearchParams({ count: String(nextCount) });

    if (skills?.length) {
      const normalizedSkills = skills
        .map((skillId) => Math.trunc(skillId))
        .filter((skillId) => Number.isFinite(skillId));
      if (normalizedSkills.length > 0) {
        params.set('skills', normalizedSkills.join(','));
      }
    }

    const result = await request<unknown>(`/practice/set?${params.toString()}`, {
      method: 'GET',
      firebaseIdToken: token,
    });

    return normalizeQuestionSetPayload(result);
  },

  async submitAttempt(
    firebaseIdToken: string,
    payload: {
      question_id: number;
      chosen_choice: ChoiceKey;
      time_spent_seconds?: number | null;
      attempt_source?: 'practice' | 'test' | string;
    },
  ): Promise<AttemptResult> {
    const token = requireToken(firebaseIdToken);
    const body = {
      question_id: payload.question_id,
      chosen_choice: payload.chosen_choice,
      time_spent_seconds: payload.time_spent_seconds ?? null,
      attempt_source: payload.attempt_source ?? 'practice',
    };

    const result = await request<unknown>('/attempts', {
      method: 'POST',
      firebaseIdToken: token,
      body: JSON.stringify(body),
    });

    return normalizeAttemptResult(result);
  },

  async getAdaptiveNext(
    firebaseIdToken: string,
    state: {
      seenQuestionIds: number[];
      lastCorrect: boolean | null;
      currentDifficulty: number | null;
      skills?: number[];
    },
  ): Promise<AdaptiveNextResponse> {
    const token = requireToken(firebaseIdToken);
    const body: Record<string, unknown> = {
      seen_question_ids: state.seenQuestionIds
        .map((id) => Math.trunc(id))
        .filter((id) => Number.isFinite(id)),
      last_correct: state.lastCorrect,
      current_difficulty: state.currentDifficulty,
    };
    if (state.skills?.length) {
      body.skills = state.skills.map((s) => Math.trunc(s)).filter((s) => Number.isFinite(s));
    }

    const result = await request<unknown>('/practice/next', {
      method: 'POST',
      firebaseIdToken: token,
      body: JSON.stringify(body),
    });

    const source = isRecord(result) ? result : {};
    const rawQuestion = (source as { question?: unknown }).question;
    const question = rawQuestion ? normalizePracticeQuestion(rawQuestion) : null;

    return {
      question,
      target_difficulty: toFiniteNumber((source as { target_difficulty?: unknown }).target_difficulty, 3),
      target_skill_id:
        typeof (source as { target_skill_id?: unknown }).target_skill_id === 'number'
          ? ((source as { target_skill_id: number }).target_skill_id)
          : null,
      exhausted: Boolean((source as { exhausted?: unknown }).exhausted) || question === null,
    };
  },

  async createTestSession(firebaseIdToken: string, count = 22): Promise<TestSession> {
    const token = requireToken(firebaseIdToken);
    const nextCount = Math.min(60, Math.max(5, Math.trunc(count || 22)));

    const result = await request<unknown>('/tests/sessions', {
      method: 'POST',
      firebaseIdToken: token,
      body: JSON.stringify({ count: nextCount }),
    });

    return normalizeTestSessionPayload(result);
  },

  async getTestSession(firebaseIdToken: string, sessionId: number): Promise<TestSession> {
    const token = requireToken(firebaseIdToken);
    const result = await request<unknown>(`/tests/sessions/${sessionId}`, {
      method: 'GET',
      firebaseIdToken: token,
    });

    return normalizeTestSessionPayload(result);
  },

  async submitTestSession(
    firebaseIdToken: string,
    sessionId: number,
    payload: SubmitTestPayload,
  ): Promise<SubmitTestResponse> {
    const token = requireToken(firebaseIdToken);
    const body = {
      answers: payload.answers.map((answer) => ({
        id: answer.id,
        chosen_choice: answer.chosen_choice,
      })),
    };

    const result = await request<unknown>(`/tests/sessions/${sessionId}/submit`, {
      method: 'POST',
      firebaseIdToken: token,
      body: JSON.stringify(body),
    });

    return normalizeSubmitTestResponse(result);
  },

  async getAnalyticsOverview(firebaseIdToken: string, range = '30d'): Promise<AnalyticsOverview> {
    const token = requireToken(firebaseIdToken);
    return request<AnalyticsOverview>(`/analytics/overview?range=${encodeURIComponent(range)}`, {
      method: 'GET',
      firebaseIdToken: token,
    });
  },

  async getRecommendations(firebaseIdToken: string): Promise<RecommendationItem[]> {
    const token = requireToken(firebaseIdToken);
    return request<RecommendationItem[]>('/recommendations', {
      method: 'GET',
      firebaseIdToken: token,
    });
  },

  async refreshRecommendations(firebaseIdToken: string): Promise<RecommendationItem[]> {
    const token = requireToken(firebaseIdToken);
    return request<RecommendationItem[]>('/recommendations/refresh', {
      method: 'POST',
      firebaseIdToken: token,
    });
  },

  async getLessons(firebaseIdToken: string, skillId?: number): Promise<Lesson[]> {
    const token = requireToken(firebaseIdToken);
    const path = Number.isFinite(skillId) ? `/lessons?skill_id=${Math.trunc(skillId as number)}` : '/lessons';
    return request<Lesson[]>(path, {
      method: 'GET',
      firebaseIdToken: token,
    });
  },

  async getLessonById(firebaseIdToken: string, lessonId: number): Promise<Lesson> {
    const token = requireToken(firebaseIdToken);
    return request<Lesson>(`/lessons/${lessonId}`, {
      method: 'GET',
      firebaseIdToken: token,
    });
  },

  async getHealth(): Promise<{ status: string }> {
    return request<{ status: string }>('/health', { method: 'GET' });
  },

  async getCourses(): Promise<ApiResponse<Course[]>> {
    return withMockFallback(
      async () => {
        const response = await request<ApiResponse<Course[]>>('/courses');
        return {
          ...response,
          data: response.data.filter((course) => course.id === PRIMARY_COURSE_ID),
        };
      },
      async () => {
        await wait(250);
        return {
          success: true,
          message: 'Courses loaded',
          data: courses,
        };
      },
    );
  },

  async getCourseById(courseId: string): Promise<ApiResponse<Course | null>> {
    if (courseId !== PRIMARY_COURSE_ID) {
      return {
        success: false,
        message: 'Course not available.',
        data: null,
      };
    }

    return withMockFallback(
      async () => {
        const response = await request<ApiResponse<Course | null>>(`/courses/${courseId}`);
        if (!response.data || response.data.id !== PRIMARY_COURSE_ID) {
          return {
            ...response,
            data: null,
          };
        }

        return response;
      },
      async () => {
        await wait(240);
        return {
          success: true,
          message: 'Course loaded',
          data: courses.find((course) => course.id === courseId) ?? null,
        };
      },
    );
  },

  async getBlogPosts(): Promise<ApiResponse<BlogPost[]>> {
    return withMockFallback(
      async () => request<ApiResponse<BlogPost[]>>('/blog'),
      async () => {
        await wait(220);
        return {
          success: true,
          message: 'Blog loaded',
          data: blogPosts,
        };
      },
    );
  },

  async getPricing(): Promise<ApiResponse<Plan[]>> {
    return withMockFallback(
      async () => request<ApiResponse<Plan[]>>('/pricing'),
      async () => {
        await wait(200);
        return {
          success: true,
          message: 'Plans loaded',
          data: pricingPlans,
        };
      },
    );
  },

  async subscribeNewsletter(payload: NewsletterPayload): Promise<ApiResponse<null>> {
    return withMockFallback(
      async () =>
        request<ApiResponse<null>>('/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      async () => {
        await wait(350);
        return {
          success: true,
          message: `${payload.email} subscribed`,
          data: null,
        };
      },
    );
  },

  async submitContact(payload: ContactPayload): Promise<ApiResponse<null>> {
    return withMockFallback(
      async () =>
        request<ApiResponse<null>>('/contact', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      async () => {
        await wait(350);
        return {
          success: true,
          message: `Thanks ${payload.name}, we will respond soon`,
          data: null,
        };
      },
    );
  },

  async confirmCheckout(payload: CheckoutPayload): Promise<ApiResponse<{ receiptId: string }>> {
    return withMockFallback(
      async () =>
        request<ApiResponse<{ receiptId: string }>>('/checkout/confirm', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      async () => {
        await wait(500);
        return {
          success: true,
          message: 'Payment confirmed',
          data: {
            receiptId: `R-${Math.floor(Math.random() * 900000 + 100000)}`,
          },
        };
      },
    );
  },
};

export function hasBackendConfigured(): boolean {
  return Boolean(API_BASE_URL);
}
