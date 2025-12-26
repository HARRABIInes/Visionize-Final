/**
 * Main Application Component (App.jsx)
 * 
 * This is the root component of the Visionise frontend.
 * It sets up:
 * - React Router for client-side navigation
 * - Authentication Context Provider for global auth state
 * - Routes configuration for all pages
 * - Header and Footer components present on all pages
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from  "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Project from "./pages/Project";
import "./App.css";


function App() {
  return (
    // Wrap entire app with AuthProvider to share authentication state
    <AuthProvider>
      {/* Enable client-side routing */}
      <BrowserRouter>
        {/* Header with navigation (visible on all pages) */}
        <Header />
        
        {/* Define application routes */}
        <Routes>
          <Route path="/" element={<Home />} />                      {/* Landing page */}
          <Route path="/signin" element={<SignIn />} />              {/* Login page */}
          <Route path="/signup" element={<SignUp />} />              {/* Registration page */}
          <Route path="/profile" element={<Profile />} />            {/* User dashboard */}
          <Route path="/edit-profile" element={<EditProfile />} />  {/* Profile editing */}
          <Route path="/project/:id" element={<Project />} />       {/* Project details with tasks */}
        </Routes>
        
        {/* Footer (visible on all pages) */}
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



