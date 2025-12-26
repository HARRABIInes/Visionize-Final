/**
 * API Utility Module (api.js)
 * 
 * Provides core utilities for communicating with the backend API.
 * Handles:
 * - JWT token storage and retrieval from localStorage
 * - Automatic token injection into API requests
 * - Centralized API error handling
 * - Session persistence
 */

// Get API base URL from environment variable (defaults to localhost:5001)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// localStorage key for storing session data
const SESSION_KEY = "visionize_session";

/**
 * Store JWT token and user data in localStorage
 * Called after successful login/signup
 * 
 * @param {string} token - JWT token from backend
 * @param {Object} user - User data (email, firstName, lastName)
 */
export const setAuthToken = (token, user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
};

/**
 * Clear authentication data from localStorage
 * Called on logout
 */
export const clearAuthToken = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Retrieve stored session from localStorage
 * 
 * @returns {Object|null} { token, user } or null if not found
 */
export const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;  // Return null if parsing fails
  }
};

/**
 * Make authenticated API request
 * Automatically attaches JWT token from localStorage if available.
 * 
 * @param {string} path - API endpoint path (e.g., "/projects")
 * @param {Object} options - Fetch options (method, body, headers)
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {Error} If response is not ok (4xx, 5xx status codes)
 */
export const apiFetch = async (path, options = {}) => {
  // Get current session from localStorage
  const session = getStoredSession();
  
  // Build request headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  
  // Attach JWT token if user is authenticated
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  // Make HTTP request to backend
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle error responses (4xx, 5xx)
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.error || res.statusText;
    throw new Error(message);  // Throw error to be caught by caller
  }

  // Handle 204 No Content responses
  if (res.status === 204) return null;
  
  // Parse and return JSON response
  return res.json();
};
