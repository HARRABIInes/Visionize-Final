/**
 * Authentication Context (AuthContext.jsx)
 * 
 * Provides global authentication state and methods to the entire app.
 * Handles:
 * - User sign up and sign in
 * - JWT token storage in localStorage
 * - User session persistence across page reloads
 * - Logout functionality
 * 
 * Usage: const { user, isSignedIn, signIn, signUp, logout } = useAuth();
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { signInApi, signUpApi } from "../services/auth";
import { setAuthToken, clearAuthToken, getStoredSession } from "../services/api";

// Create context for authentication state
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the application and provides authentication state to all children.
 */
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [isSignedIn, setIsSignedIn] = useState(false);  // Is user logged in?
  const [user, setUser] = useState(null);                // User data (email, firstName, lastName)
  const [loading, setLoading] = useState(true);          // Loading state for initial session check

  /**
   * Effect: Restore Session on App Load
   * Checks localStorage for existing JWT token and restores user session
   */
  useEffect(() => {
    const session = getStoredSession();  // Get { token, user } from localStorage
    if (session?.token && session?.user) {
      setAuthToken(session.token, session.user);  // Restore token for API calls
      setUser(session.user);                       // Restore user data
      setIsSignedIn(true);                         // Mark as logged in
    }
    setLoading(false);  // Finished checking session
  }, []);

  /**
   * Sign Up Function
   * Registers a new user and automatically logs them in.
   */
  const signUp = async (formData) => {
    const { user: createdUser, token } = await signUpApi(formData);
    setAuthToken(token, createdUser);  // Save token to localStorage
    setUser(createdUser);               // Update state
    setIsSignedIn(true);
  };

  /**
   * Sign In Function
   * Logs in an existing user with email and password.
   */
  const signIn = async (formData) => {
    const { user: loggedUser, token } = await signInApi(formData);
    setAuthToken(token, loggedUser);  // Save token to localStorage
    setUser(loggedUser);               // Update state
    setIsSignedIn(true);
  };

  /**
   * Logout Function
   * Clears user session and redirects to login.
   */
  const logout = () => {
    clearAuthToken();        // Remove token from localStorage
    setUser(null);           // Clear user data
    setIsSignedIn(false);    // Mark as logged out
  };

  // Provide authentication state and methods to all children
  return (
    <AuthContext.Provider value={{ isSignedIn, user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth
 * Provides easy access to authentication context.
 * 
 * @throws {Error} If used outside AuthProvider
 * @returns {Object} { isSignedIn, user, loading, signUp, signIn, logout }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
