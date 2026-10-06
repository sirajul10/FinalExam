import React, { createContext, useEffect, useState } from "react";
import { baseurl } from "../services/Baseurl";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAutuser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("lg_token");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${baseurl}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        localStorage.removeItem("lg_token");
        setAutuser(null);
        return;
      }

      setAutuser(data);
    } catch (error) {
      console.error("Fetch user error:", error);
      setAutuser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setAutuser(null);
      setLoading(false);
      return;
    }

    fetchUser();
  }, [accessToken]);

  const logout = () => {
    localStorage.removeItem("lg_token");
    setAutuser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAutuser,
        logout,
        accessToken,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
