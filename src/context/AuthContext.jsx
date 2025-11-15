import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const signUp = (userData) => {
    setUser(userData);
    setIsSignedIn(true);
    // Optionally store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signIn = (userData) => {
    setUser(userData);
    setIsSignedIn(true);
    // Optionally store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signUp, signIn, logout }}>
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
