import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AUTH_BASE_URL } from "../data";

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  authenticatedAt?: string;
  source?: string;
}

interface UserContextType {
  user: User | null;
  rol: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  rol: null,
  loading: true,
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_BASE_URL}/auth/status`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        setRol(data.rol);
      } else {
        setUser(null);
        setRol(null);
      }
    } catch {
      setUser(null);
      setRol(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, rol, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
