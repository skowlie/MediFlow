// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext(); // ✅ Named export added

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const storedAuth = JSON.parse(localStorage.getItem("authUser"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const activeUser = storedAuth || storedUser;

  if (activeUser) {
    setUser(activeUser);
    localStorage.setItem("user", JSON.stringify(activeUser)); // keep both synced
  }
  setLoading(false);
}, []);


  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook to access the context easily
export const useUser = () => useContext(UserContext);

// ✅ Default export for compatibility (optional but helpful)
export default UserContext;
