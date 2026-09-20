import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const DEFAULT_CREDENTIALS = {
  email: "bhupeshdewangan160204@gmail.com",
  resumeUrl: "https://res.cloudinary.com/djoybtphx/image/upload/v1770306336/Bhupesh_Dewangan_Resume_zppcik.pdf",
  githubUrl: "https://github.com/Bhupesh-Dewangan",
  linkedinUrl: "https://www.linkedin.com/in/bhupesh--dewangan/",
  codolioUrl: "https://codolio.com/profile/BhupeshD",
  whatsappUrl: "https://wa.me/8982828605",
  instagramUrl: "https://www.instagram.com/bhupesh_dewangan_16/",
};

const CredentialsContext = createContext({
  credentials: DEFAULT_CREDENTIALS,
  loading: true,
  refreshCredentials: () => {},
});

export const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [loading, setLoading] = useState(true);

  const fetchCredentials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/credentials`);
      if (res.ok) {
        const data = await res.json();
        setCredentials({
          email: data.email || DEFAULT_CREDENTIALS.email,
          resumeUrl: data.resumeUrl || DEFAULT_CREDENTIALS.resumeUrl,
          githubUrl: data.githubUrl || DEFAULT_CREDENTIALS.githubUrl,
          linkedinUrl: data.linkedinUrl || DEFAULT_CREDENTIALS.linkedinUrl,
          codolioUrl: data.codolioUrl || DEFAULT_CREDENTIALS.codolioUrl,
          whatsappUrl: data.whatsappUrl || DEFAULT_CREDENTIALS.whatsappUrl,
          instagramUrl: data.instagramUrl || DEFAULT_CREDENTIALS.instagramUrl,
        });
      }
    } catch (error) {
      console.warn("Failed to fetch credentials from backend, using defaults:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  return (
    <CredentialsContext.Provider
      value={{
        credentials,
        loading,
        refreshCredentials: fetchCredentials,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};

export const useCredentials = () => useContext(CredentialsContext);
