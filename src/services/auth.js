/**
 * Authentication Service (auth.js)
 * 
 * Handles authentication-related API calls:
 * - User registration (signup)
 * - User login (signin)
 * - Session management
 */

import { apiFetch, setAuthToken, getStoredSession } from "./api";

/**
 * Sign Up New User
 * 
 * Registers a new user account, then automatically signs them in.
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.profession - Profession/job title
 * @param {string} userData.birthDate - Birth date
 * @returns {Promise<Object>} { user, token }
 */
export const signUpApi = async ({ email, password, firstName, lastName, profession, birthDate }) => {
  // Step 1: Register new user
  const data = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName, profession, birthDate })
  });
  
  // Step 2: Automatically sign in to get JWT token
  const signin = await signInApi({ email, password });
  
  // Return user data and token
  return { user: signin.user, token: signin.token };
};

/**
 * Sign In Existing User
 * 
 * Authenticates user with email and password.
 * Stores JWT token in localStorage.
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} { user, token }
 */
export const signInApi = async ({ email, password }) => {
  // Call backend signin endpoint
  const data = await apiFetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  
  // Store token and user data in localStorage
  setAuthToken(data.token, data.user);
  
  return data;
};

/**
 * Get Current Session
 * 
 * Retrieves stored session from localStorage.
 * 
 * @returns {Object|null} { token, user } or null if not logged in
 */
export const getSession = () => getStoredSession();
