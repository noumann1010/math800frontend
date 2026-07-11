/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Course, User } from '../types';
import { subscribeToFirebaseAuthState } from '../lib/firebase';

type ToastType = 'success' | 'info' | 'error';

type ToastState = {
  id: number;
  message: string;
  type: ToastType;
};

type AppContextValue = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  firebaseIdToken: string | null;
  setFirebaseIdToken: (token: string | null) => void;
  authReady: boolean;
  notify: (message: string, type?: ToastType) => void;
  toasts: ToastState[];
  dismissToast: (id: number) => void;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

const storageKeys = {
  course: 'math800:selected-course',
  user: 'math800:user',
  firebaseIdToken: 'math800:firebase-id-token',
};

function parseStoredJson<T>(rawValue: string | null): T | null {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCourse, setSelectedCourseState] = useState<Course | null>(() =>
    parseStoredJson<Course>(localStorage.getItem(storageKeys.course)),
  );
  const [user, setUserState] = useState<User | null>(() =>
    parseStoredJson<User>(localStorage.getItem(storageKeys.user)),
  );
  const [firebaseIdToken, setFirebaseIdTokenState] = useState<string | null>(
    () => localStorage.getItem(storageKeys.firebaseIdToken),
  );
  const [authReady, setAuthReady] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeToFirebaseAuthState(
        async (firebaseUser) => {
          if (firebaseUser) {
            const token = await firebaseUser.getIdToken();
            setFirebaseIdTokenState(token);
            setUserState((current) => ({
              id: firebaseUser.uid,
              name:
                current?.name ??
                firebaseUser.displayName ??
                firebaseUser.email?.split('@')[0] ??
                'Student',
              email: current?.email ?? firebaseUser.email ?? '',
            }));
          } else {
            setUserState(null);
            setFirebaseIdTokenState(null);
          }

          setAuthReady(true);
        },
        () => {
          setAuthReady(true);
        },
      );
    } catch {
      window.setTimeout(() => {
        setAuthReady(true);
      }, 0);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem(storageKeys.course, JSON.stringify(selectedCourse));
      return;
    }

    localStorage.removeItem(storageKeys.course);
  }, [selectedCourse]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKeys.user, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(storageKeys.user);
  }, [user]);

  useEffect(() => {
    if (firebaseIdToken) {
      localStorage.setItem(storageKeys.firebaseIdToken, firebaseIdToken);
      return;
    }

    localStorage.removeItem(storageKeys.firebaseIdToken);
  }, [firebaseIdToken]);

  const setSelectedCourse = useCallback((course: Course | null) => {
    setSelectedCourseState(course);
  }, []);

  const setUser = useCallback((nextUser: User | null) => {
    setUserState(nextUser);
  }, []);

  const setFirebaseIdToken = useCallback((token: string | null) => {
    setFirebaseIdTokenState(token);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(
    () => ({
      selectedCourse,
      setSelectedCourse,
      user,
      setUser,
      firebaseIdToken,
      setFirebaseIdToken,
      authReady,
      notify,
      toasts,
      dismissToast,
    }),
    [
      dismissToast,
      notify,
      selectedCourse,
      setSelectedCourse,
      user,
      setUser,
      firebaseIdToken,
      setFirebaseIdToken,
      authReady,
      toasts,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
