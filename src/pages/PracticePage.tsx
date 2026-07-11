import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkdown } from '../components/QuestionMarkdown';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';
import type { AttemptResult, ChoiceKey, PracticeQuestion } from '../types';

// Target length of an adaptive session before we offer a summary. The learner
// can always keep going past this.
const SESSION_TARGET = 10;
const MAX_DIFFICULTY = 5;

export function PracticePage() {
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [started, setStarted] = useState(false);

  const { authReady, firebaseIdToken, notify } = useAppContext();
  const navigate = useNavigate();

  const hasToken = Boolean(firebaseIdToken);

  const loadNext = useCallback(
    async (lastCorrect: boolean | null, seenForRequest: number[], difficulty: number | null) => {
      if (!firebaseIdToken) {
        notify('Sign in first to start practicing.', 'error');
        return;
      }

      try {
        setLoading(true);
        setStarted(true);
        setResult(null);
        setSelectedChoice(null);

        const next = await api.getAdaptiveNext(firebaseIdToken, {
          seenQuestionIds: seenForRequest,
          lastCorrect,
          currentDifficulty: difficulty,
        });

        if (next.exhausted || !next.question) {
          setQuestion(null);
          setExhausted(true);
          return;
        }

        setExhausted(false);
        setQuestion(next.question);
        setCurrentDifficulty(next.target_difficulty);
        setSeenIds((current) =>
          current.includes(next.question!.id) ? current : [...current, next.question!.id],
        );
      } catch (error) {
        notify((error as Error).message || 'Could not load the next question', 'error');
      } finally {
        setLoading(false);
      }
    },
    [firebaseIdToken, notify],
  );

  // Kick off the session automatically once authenticated.
  useEffect(() => {
    if (hasToken && !started) {
      void loadNext(null, [], null);
    }
  }, [hasToken, started, loadNext]);

  const handleAnswer = async (chosenChoice: ChoiceKey) => {
    if (!firebaseIdToken || !question || result) {
      return;
    }

    try {
      setSubmitting(true);
      setSelectedChoice(chosenChoice);
      const attemptResult = await api.submitAttempt(firebaseIdToken, {
        question_id: question.id,
        chosen_choice: chosenChoice,
        attempt_source: 'practice',
        time_spent_seconds: null,
      });
      setResult(attemptResult);
      setAnsweredCount((count) => count + 1);
      if (attemptResult.is_correct) {
        setCorrectCount((count) => count + 1);
      }
    } catch (error) {
      setSelectedChoice(null);
      notify((error as Error).message || 'Attempt submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (!result) {
      return;
    }
    void loadNext(result.is_correct, seenIds, currentDifficulty);
  };

  const restart = () => {
    setSeenIds([]);
    setCurrentDifficulty(null);
    setAnsweredCount(0);
    setCorrectCount(0);
    setResult(null);
    setSelectedChoice(null);
    setQuestion(null);
    setExhausted(false);
    void loadNext(null, [], null);
  };

  const accuracy = useMemo(
    () => (answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0),
    [answeredCount, correctCount],
  );

  const reachedTarget = answeredCount >= SESSION_TARGET;
  const difficultyLabel = currentDifficulty ?? 3;

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
          <p>Sign in to start your adaptive practice session.</p>
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
            <h1>Adaptive Practice</h1>
            <p>
              Each question is chosen from how you are doing right now. Answer correctly and the next
              question gets harder; miss one and it eases off to rebuild the skill.
            </p>
          </div>
          <div className="practice-actions">
            <span className="practice-progress">
              Answered {answeredCount} · {accuracy}% correct
            </span>
            <button className="btn btn--ghost" onClick={() => navigate('/diagnostic')}>
              Switch to Diagnostic Test
            </button>
          </div>
        </div>

        <div className="adaptive-status">
          <div className="adaptive-status__meter" aria-label={`Current difficulty ${difficultyLabel} of ${MAX_DIFFICULTY}`}>
            {Array.from({ length: MAX_DIFFICULTY }, (_, index) => (
              <span
                key={index}
                className={index < difficultyLabel ? 'adaptive-dot adaptive-dot--on' : 'adaptive-dot'}
              />
            ))}
          </div>
          <span className="adaptive-status__label">
            Difficulty {difficultyLabel}/{MAX_DIFFICULTY} · adapting to your answers
          </span>
        </div>

        {loading ? <p>Selecting your next question...</p> : null}

        {!loading && exhausted ? (
          <div className="empty-state">
            <h2>You have worked through the available questions.</h2>
            <p>Great session — {correctCount}/{answeredCount} correct ({accuracy}%).</p>
            <button className="btn btn--solid" onClick={restart}>
              Start a fresh session
            </button>
          </div>
        ) : null}

        {!loading && question ? (
          <article className="question-card">
            <header className="question-head">
              <div className="question-prompt">
                <p className="question-number">Question {answeredCount + 1}</p>
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
                ([choiceKey, choiceText]) => {
                  const isSelected = selectedChoice === choiceKey;
                  const isCorrectChoice = result?.correct_choice === choiceKey;
                  const showAsCorrect = Boolean(result) && isCorrectChoice;
                  const showAsWrong = Boolean(result) && isSelected && !result?.is_correct;

                  let className = 'choice-pill';
                  if (showAsCorrect) className = 'choice-pill choice-pill--correct';
                  else if (showAsWrong) className = 'choice-pill choice-pill--wrong';
                  else if (isSelected) className = 'choice-pill choice-pill--selected';

                  return (
                    <button
                      key={choiceKey}
                      className={className}
                      disabled={Boolean(result) || submitting}
                      onClick={() => void handleAnswer(choiceKey)}
                    >
                      <strong>{choiceKey}</strong>
                      <QuestionMarkdown text={choiceText} compact className="choice-copy" />
                    </button>
                  );
                },
              )}
            </div>

            {result ? (
              <div
                className={
                  result.is_correct ? 'attempt-feedback is-correct' : 'attempt-feedback is-wrong'
                }
              >
                <p>
                  {result.is_correct
                    ? 'Correct — the next question will step up.'
                    : `Incorrect. Correct choice: ${result.correct_choice}. The next question will ease off.`}
                </p>
                {result.explanation ? <p>{result.explanation}</p> : null}
                <div className="attempt-feedback__actions">
                  <button className="btn btn--solid" onClick={goNext}>
                    Next question
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        ) : null}

        {!loading && reachedTarget && question && !result ? (
          <div className="practice-summary">
            <p>
              You have completed {answeredCount} questions ({accuracy}% correct). Keep going or reset
              anytime.
            </p>
            <button className="btn btn--ghost" onClick={restart}>
              Reset session
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
