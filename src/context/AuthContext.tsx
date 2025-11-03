"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as any);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  async function login(email: string, password: string) {
    try {
      const res = await api.post("/api/users/login", { email, password });
        const { token, refreshToken, user } = res.data;
      localStorage.setItem("token", token);
       localStorage.setItem("refreshToken", refreshToken);
       localStorage.setItem("user", JSON.stringify(user));
      const me = await api.get("/api/users/me");
      setUser(me.data.user);
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
     localStorage.removeItem("user");
    setUser(null);
    
  }

  useEffect(() => {
    (async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (savedUser && token) {
        try {
          const me = await api.get("/api/users/me");
          setUser(me.data.user);
        } catch {
          logout();
        }
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
