import { useUser } from "@/hooks/useUser";
import { supabase } from "@/supabase";
import { getUserById } from "@/supabase/users";
import { userT } from "@/types";
import { router } from "expo-router";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";

type appContextT = {
  userMethods: ReturnType<typeof useUser>;
};

const AppContext = createContext<appContextT | null>(null);

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return appContext;
};

const AppContextProvider: FC<PropsWithChildren> = (props) => {
  const userMethods = useUser();
  const { user } = userMethods;
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        supabase.auth.signInWithPassword({
          email: "wale@gmail.com",
          password: "123456789",
        });
      }

      if (session?.user) {
        getUserById(session.user.id).then(({ data, error }) => {
          if (data) {
            userMethods.setUser(data as userT);
            router.push("/tabs");
          } else {
            console.error("Error fetching user:", error);
          }
        });
      }
    });
  }, []);

  return (
    <AppContext.Provider value={{ userMethods }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
