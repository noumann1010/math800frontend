import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkdown } from '../components/QuestionMarkdown';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { ChoiceKey, TestSession } from '../types';

const DIAGNOSTIC_QUESTION_COUNT = 22;

export function DiagnosticTestPage() {
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
      notify('Sign in first to start a diagnostic test.', 'error');
      return;
    }

    try {
      setLoadingSession(true);
      setSubmitSummary(null);
      const nextSession = await api.createTestSession(firebaseIdToken, DIAGNOSTIC_QUESTION_COUNT);
      setSession(nextSession);
      setAnswersByQuestionId({});

      const returnedCount = nextSession.questions.length;

      if (returnedCount !== DIAGNOSTIC_QUESTION_COUNT) {
        notify(
          `Expected ${DIAGNOSTIC_QUESTION_COUNT} questions, received ${returnedCount}. This points to backend question availability, not frontend rendering.`,
          'error',
        );
      } else {
        notify(`Diagnostic test #${nextSession.id} started with ${returnedCount} questions`, 'success');
      }
    } catch (error) {
      notify((error as Error).message || 'Could not start the diagnostic test', 'error');
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
      notify((error as Error).message || 'Diagnostic submission failed', 'error');
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
          <h1>Diagnostic Test</h1>
          <p>Sign in to take your diagnostic test.</p>
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
            <p className="eyebrow">Diagnostic Test</p>
            <h1>Baseline Assessment</h1>
            <p>
              A broad, fixed set of questions spanning every SAT Math skill and difficulty tier. It
              maps your strengths and gaps so adaptive practice can target the right areas next.
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
            {loadingSession ? 'Starting...' : 'Start New Diagnostic Test'}
          </button>

          <button
            className="btn btn--ghost"
            onClick={submitSession}
            disabled={!session || submitting || orderedQuestions.length === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Diagnostic'}
          </button>
        </div>

        {submitSummary ? (
          <div className="attempt-feedback is-correct">
            <p>
              Diagnostic Result: {submitSummary.correct}/{submitSummary.total} (
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
            <p>No valid questions were returned. Please start a new diagnostic test.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
