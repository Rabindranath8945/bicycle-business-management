// "use client";

// import { createContext, useState, useEffect, ReactNode } from "react";
// import api from "../axiosInstance";
// // import jwtDecode from "jwt-decode";

// type User = { id: string; name: string; email: string } | null;

// interface AuthType {
//   user: User;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.post("/api/auth/refresh");
//         setToken(res.data.accessToken);
//         setUser(res.data.user);
//       } catch {}
//     })();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const res = await api.post("/api/auth/login", { email, password });
//     setToken(res.data.accessToken);
//     setUser(res.data.user);
//   };

//   const logout = async () => {
//     await api.post("/api/auth/logout");
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
