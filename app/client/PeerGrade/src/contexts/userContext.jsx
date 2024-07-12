import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const setUserContext = async () => {
    try {
      setUserLoading(true);
      const userInfo = await getCurrentUser();
      setUser(userInfo);
    } catch (error) {
    } finally {
      setUserLoading(false);
    }
  };

  const clearUserContext = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, userLoading, setUserContext, clearUserContext }}
    >
      {children}
    </UserContext.Provider>
  );
};
