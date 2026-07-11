import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkdown } from '../components/QuestionMarkdown';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { AttemptResult, ChoiceKey, PracticeQuestion } from '../types';

export function PracticePage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answerByQuestionId, setAnswerByQuestionId] = useState<Record<number, ChoiceKey>>({});
  const [resultByQuestionId, setResultByQuestionId] = useState<Record<number, AttemptResult>>({});

  const { authReady, firebaseIdToken, notify } = useAppContext();
  const navigate = useNavigate();

  const hasToken = Boolean(firebaseIdToken);

  const loadPracticeSet = async () => {
    if (!firebaseIdToken) {
      notify('Sign in first to load your practice set.', 'error');
      return;
    }

    if (questions.length > 0) {
      return;
    }

    try {
      setLoading(true);
      const fetchedQuestions = await api.getPracticeSet(firebaseIdToken, 10);
      setQuestions(fetchedQuestions);
      notify(`Loaded ${fetchedQuestions.length} practice questions`, 'success');
    } catch (error) {
      notify((error as Error).message || 'Could not load practice set', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasToken && questions.length === 0) {
      void loadPracticeSet();
    }
    // questions should not be a dependency: we intentionally fetch once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  const answerCount = useMemo(() => Object.keys(resultByQuestionId).length, [resultByQuestionId]);

  const handleAnswer = async (questionId: number, chosenChoice: ChoiceKey) => {
    if (!firebaseIdToken) {
      notify('Sign in first to submit attempts.', 'error');
      return;
    }

    try {
      setAnswerByQuestionId((current) => ({ ...current, [questionId]: chosenChoice }));
      const attemptResult = await api.submitAttempt(firebaseIdToken, {
        question_id: questionId,
        chosen_choice: chosenChoice,
        attempt_source: 'practice',
        time_spent_seconds: null,
      });
      setResultByQuestionId((current) => ({ ...current, [questionId]: attemptResult }));
    } catch (error) {
      notify((error as Error).message || 'Attempt submission failed', 'error');
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
          <h1>Practice Mode</h1>
          <p>Sign in to access your protected practice question sets.</p>
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
            <p className="eyebrow">Practice Mode</p>
            <h1>Dynamic Practice Set</h1>
            <p>
              Questions come directly from backend set selection. Correctness and explanation are
              shown only from attempt responses.
            </p>
          </div>
          <div className="practice-actions">
            <span className="practice-progress">Scored: {answerCount}/{questions.length || 10}</span>
            <button className="btn btn--ghost" onClick={() => navigate('/full-test')}>
              Switch to Full Test
            </button>
          </div>
        </div>

        {loading ? <p>Loading practice set...</p> : null}

        {!loading && questions.length === 0 ? (
          <button className="btn btn--solid" onClick={loadPracticeSet}>
            Load Practice Set
          </button>
        ) : null}

        <div className="question-list">
          {questions.map((question) => {
            const answer = answerByQuestionId[question.id];
            const attemptResult = resultByQuestionId[question.id];

            return (
              <article key={question.id} className="question-card">
                <header className="question-head">
                  <div className="question-prompt">
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
                          answer === choiceKey ? 'choice-pill choice-pill--selected' : 'choice-pill'
                        }
                        onClick={() => void handleAnswer(question.id, choiceKey)}
                      >
                        <strong>{choiceKey}</strong>
                        <QuestionMarkdown text={choiceText} compact className="choice-copy" />
                      </button>
                    ),
                  )}
                </div>

                {attemptResult ? (
                  <div
                    className={
                      attemptResult.is_correct ? 'attempt-feedback is-correct' : 'attempt-feedback is-wrong'
                    }
                  >
                    <p>
                      {attemptResult.is_correct
                        ? 'Correct'
                        : `Incorrect. Correct choice: ${attemptResult.correct_choice}`}
                    </p>
                    <p>{attemptResult.explanation}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
