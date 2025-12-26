import React, { createContext, useState, useContext, useEffect } from "react";
import { signInApi, signUpApi } from "../services/auth";
import { setAuthToken, clearAuthToken, getStoredSession } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.token && session?.user) {
      setAuthToken(session.token, session.user);
      setUser(session.user);
      setIsSignedIn(true);
    }
    setLoading(false);
  }, []);

  const signUp = async (formData) => {
    const { user: createdUser, token } = await signUpApi(formData);
    setAuthToken(token, createdUser);
    setUser(createdUser);
    setIsSignedIn(true);
  };

  const signIn = async (formData) => {
    const { user: loggedUser, token } = await signInApi(formData);
    setAuthToken(token, loggedUser);
    setUser(loggedUser);
    setIsSignedIn(true);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
