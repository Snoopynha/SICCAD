import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (user) {
      setUsuario(JSON.parse(user));
    }

    setLoading(false);
  }, []);

  function login(userData) {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUsuario(userData);
  }

  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}