const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const SESSION_KEY = "visionize_session";

export const setAuthToken = (token, user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
};

export const clearAuthToken = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const apiFetch = async (path, options = {}) => {
  const session = getStoredSession();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.error || res.statusText;
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
};
