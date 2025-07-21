import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const dummyUsers = {
  superadmin: [
    { id: 1, name: "Super Admin A", role: "superadmin" },
    { id: 2, name: "Super Admin B", role: "superadmin" },
    { id: 3, name: "Super Admin C", role: "superadmin" },
  ],
  admin: [
    { id: 4, name: "Admin A", role: "admin" },
    { id: 5, name: "Admin B", role: "admin" },
    { id: 6, name: "Admin C", role: "admin" },
  ],
  student: [
    { id: 7, name: "Student A", role: "student" },
    { id: 8, name: "Student B", role: "student" },
    { id: 9, name: "Student C", role: "student" },
  ],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (role) => {
    const users = dummyUsers[role];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    setUser(randomUser);
    localStorage.setItem("user", JSON.stringify(randomUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
