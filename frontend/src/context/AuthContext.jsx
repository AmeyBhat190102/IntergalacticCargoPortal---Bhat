import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    email: null,
  });
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setAuth({ token, role: payload.role, email: payload.sub });
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  function login(token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return;
    localStorage.setItem("token", token);
    setAuth({ token, role: payload.role, email: payload.sub });
  }

  function logout() {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null, email: null });
  }

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isAdmin: auth.role === "Admin",
        isAuthenticated: !!auth.token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
