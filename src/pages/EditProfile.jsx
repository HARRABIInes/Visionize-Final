import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    profession: user?.profession || "",
    birthDate: user?.birthDate || "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data in auth context
    signUp({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      profession: formData.profession,
      birthDate: formData.birthDate,
    });

    setSuccessMessage("Profil mis à jour avec succès!");
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-inner">
        <h1>Modifier votre profil</h1>
        <p className="subtitle">Mettez à jour vos informations personnelles</p>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Votre profession"
              required
            />
          </div>

          <div className="form-group">
            <label>Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
