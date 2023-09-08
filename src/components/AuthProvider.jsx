import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    email: "",
    userId: "",
  });


  const login = (email, userId) => {
    setState({ ...state, email, userId });
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
  };

  const logout = () => {
    setState({ ...state, email: "", userId: "" });
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider
      value={{
        email: state.email,
        userId: state.userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
