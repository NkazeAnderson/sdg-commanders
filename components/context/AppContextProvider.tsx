import useMessage from "@/hooks/useMessage";
import useSOS from "@/hooks/useSOS";
import useToast from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/supabase";
import { getMessages } from "@/supabase/messages";
import { getAllSOS, getMyLastResponse } from "@/supabase/sos";
import { getSubscriptions } from "@/supabase/subscriptions";
import { getUserById } from "@/supabase/users";
import { subscriptionT, userT } from "@/types";
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
  sosMethods: ReturnType<typeof useSOS>;
  messagesMethods: ReturnType<typeof useMessage>;
  subscriptions: subscriptionT[];
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
  const [subscriptions, setSubscriptions] = useState<subscriptionT[]>([]);
  const userMethods = useUser();
  const sosMethods = useSOS();
  const messagesMethods = useMessage();
  const toast = useToast();
  const { user } = userMethods;

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
        getSubscriptions().then((res) => {
          if (Array.isArray(res.data)) {
            setSubscriptions(res.data);
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
    if (!sosMethods.sos.length && user?.is_agent) {
      getAllSOS().then((res) => {
        if (res.data && Array.isArray(res.data)) {
          sosMethods.setSos(res.data);
        }
      });
    }
    if (user?.is_agent) {
      getMyLastResponse(user.id)
        .then((res) => {
          res.data ? sosMethods.setLastSosResponse(res.data) : console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (user && !messagesMethods.messages.length) {
      getMessages(user)
        .then((res) => {
          console.log(res);

          res.data &&
            Array.isArray(res.data) &&
            messagesMethods.setMessages(res.data);
        })
        .catch((e) => {});
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ userMethods, sosMethods, messagesMethods, subscriptions }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
