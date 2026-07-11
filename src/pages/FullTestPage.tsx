import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkdown } from '../components/QuestionMarkdown';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { ChoiceKey, TestSession } from '../types';

const FULL_TEST_QUESTION_COUNT = 22;

export function FullTestPage() {
  const [session, setSession] = useState<TestSession | null>(null);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<number, ChoiceKey>>({});
  const [loadingSession, setLoadingSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSummary, setSubmitSummary] = useState<{
    correct: number;
    total: number;
    accuracy: number;
  } | null>(null);

  const { authReady, firebaseIdToken, notify } = useAppContext();
  const navigate = useNavigate();

  const hasToken = Boolean(firebaseIdToken);

  const orderedQuestions = useMemo(() => {
    return (session?.questions ?? []).slice().sort((a, b) => a.order_index - b.order_index);
  }, [session]);

  const answeredCount = useMemo(
    () => Object.keys(answersByQuestionId).length,
    [answersByQuestionId],
  );

  const startSession = async () => {
    if (!firebaseIdToken) {
      notify('Sign in first to start a full test session.', 'error');
      return;
    }

    try {
      setLoadingSession(true);
      setSubmitSummary(null);
      const nextSession = await api.createTestSession(firebaseIdToken, FULL_TEST_QUESTION_COUNT);
      setSession(nextSession);
      setAnswersByQuestionId({});

      const returnedCount = nextSession.questions.length;

      if (returnedCount !== FULL_TEST_QUESTION_COUNT) {
        notify(
          `Expected ${FULL_TEST_QUESTION_COUNT} questions, received ${returnedCount}. This points to backend session generation, not frontend rendering.`,
          'error',
        );
      } else {
        notify(`Test session #${nextSession.id} started with ${returnedCount} questions`, 'success');
      }
    } catch (error) {
      notify((error as Error).message || 'Could not start test session', 'error');
    } finally {
      setLoadingSession(false);
    }
  };

  const submitSession = async () => {
    if (!firebaseIdToken || !session) {
      return;
    }

    try {
      setSubmitting(true);
      const result = await api.submitTestSession(firebaseIdToken, session.id, {
        answers: Object.entries(answersByQuestionId).map(([id, chosen_choice]) => ({
          id: Number(id),
          chosen_choice,
        })),
      });
      setSubmitSummary({ correct: result.correct, total: result.total, accuracy: result.accuracy });
      notify(`Submitted: ${result.correct}/${result.total}`, 'success');
    } catch (error) {
      notify((error as Error).message || 'Test submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady) {
    return (
      <main className="section">
        <div className="container empty-state">
          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  if (!hasToken) {
    return (
      <main className="section">
        <div className="container empty-state">
          <h1>Full Test Mode</h1>
          <p>Sign in to access your protected full test sessions.</p>
          <button className="btn btn--solid" onClick={() => navigate('/auth')}>
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container practice-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Full Test Mode</p>
            <h1>Backend Ordered Session</h1>
            <p>
              Questions are rendered in backend `order_index` order. Answers are held locally and
              submitted once.
            </p>
          </div>
          <div className="practice-actions">
            <span className="practice-progress">
              Answered: {answeredCount}/{orderedQuestions.length || 0}
            </span>
            <button className="btn btn--ghost" onClick={() => navigate('/practice')}>
              Switch to Practice
            </button>
          </div>
        </div>

        <div className="test-actions">
          <button className="btn btn--solid" onClick={startSession} disabled={loadingSession}>
            {loadingSession ? 'Starting...' : 'Start New Test Session'}
          </button>

          <button
            className="btn btn--ghost"
            onClick={submitSession}
            disabled={!session || submitting || orderedQuestions.length === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Session'}
          </button>
        </div>

        {submitSummary ? (
          <div className="attempt-feedback is-correct">
            <p>
              Session Result: {submitSummary.correct}/{submitSummary.total} (
              {Math.round(submitSummary.accuracy * 100)}%)
            </p>
          </div>
        ) : null}

        <div className="question-list">
          {orderedQuestions.map((question) => (
            <article key={`${question.order_index}-${String(question.id)}`} className="question-card">
              <header className="question-head">
                <div className="question-prompt">
                  <p className="question-number">Q{question.order_index + 1}</p>
                  <QuestionMarkdown text={question.prompt} />
                </div>
                <span className="difficulty-badge">Difficulty {question.difficulty}</span>
              </header>

              <div className="skill-tag-row">
                {question.skill_ids.map((skillId) => (
                  <span key={skillId}>Skill {skillId}</span>
                ))}
              </div>

              <div className="choice-grid">
                {(Object.entries(question.choices) as Array<[ChoiceKey, string]>).map(
                  ([choiceKey, choiceText]) => (
                    <button
                      key={choiceKey}
                      className={
                        answersByQuestionId[question.id] === choiceKey
                          ? 'choice-pill choice-pill--selected'
                          : 'choice-pill'
                      }
                      onClick={() =>
                        setAnswersByQuestionId((current) => ({
                          ...current,
                          [question.id]: choiceKey,
                        }))
                      }
                    >
                      <strong>{choiceKey}</strong>
                      <QuestionMarkdown text={choiceText} compact className="choice-copy" />
                    </button>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>

        {!loadingSession && session && orderedQuestions.length === 0 ? (
          <div className="empty-state">
            <p>No valid questions were returned for this session. Please start a new test session.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
