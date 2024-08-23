import React, { useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { validateToken } from "../api/auth";

type AppContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userId?: string;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery("validateToken", validateToken, {
    retry: false,
    staleTime: 30000, // Adjust as needed
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isError) {
      setIsLoggedIn(false);
    } else if (data) {
      setIsLoggedIn(true);
      setUserId(data.userId);
    }
  }, [data, isError, isLoading]);

  useEffect(() => {
    // Refetch the token status when context updates
    queryClient.invalidateQueries("validateToken");
  }, [isLoggedIn, queryClient]);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
