import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  const hardcodedUser: User = {
    id: "1",
    username: "devuser",
    email: "devuser@ejemplo.com",
    displayName: "Usuario Dev",
    authenticatedAt: new Date().toISOString(),
    source: "dev",
  };
  const hardcodedRol = "administrador"; // Cambia el rol

  const [user, setUser] = useState<User | null>(hardcodedUser);
  const [rol, setRol] = useState<string | null>(hardcodedRol);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setUser(hardcodedUser);
    setRol(hardcodedRol);
    setLoading(false);
  };

  useEffect(() => {
    setUser(hardcodedUser);
    setRol(hardcodedRol);
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, rol, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}