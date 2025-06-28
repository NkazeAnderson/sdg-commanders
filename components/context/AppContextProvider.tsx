import useToast from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/supabase";
import { getAllSOS, joinedSOSSchemaT } from "@/supabase/sos";
import { getUserById } from "@/supabase/users";
import { userT } from "@/types";
import { router } from "expo-router";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type appContextT = {
  userMethods: ReturnType<typeof useUser>;
  sos: joinedSOSSchemaT[];
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
  const toast = useToast();
  const { user } = userMethods;
  const [sos, setSos] = useState<joinedSOSSchemaT[]>([]);

  useEffect(() => {
    //supabase.auth.signOut();
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        getUserById(session.user.id).then(({ data, error }) => {
          if (data) {
            userMethods.setUser(data as userT);
            event === "SIGNED_IN" &&
              toast.show({ message: "Successfully signed in" });
            router.push("/tabs");
          } else if (error) {
            console.log(error);
          }
        });
      }
      if (event === "SIGNED_OUT") {
        console.log("signout");

        router.dismissAll();
        router.replace("/login");
      }
    });
  }, []);

  useEffect(() => {
    if (!sos.length && user?.is_agent) {
      getAllSOS().then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setSos(res.data);
        }
      });
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ userMethods, sos }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
