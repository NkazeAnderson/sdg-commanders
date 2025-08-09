import { useAppContext } from "@/components/context/AppContextProvider";
import Gradient from "@/components/Gradient";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { primaryColors, tables } from "@/constants";
import { registerToPostgresChanges } from "@/supabase/realtime";
import { groupT } from "@/types";
import { getUserLocation, unknownErrorHandler } from "@/utils";
import { usersSchema } from "@/zodSchema";
import { Tabs } from "expo-router";
import { LayoutDashboard, Settings, Siren } from "lucide-react-native";
import React, { useEffect, useState } from "react";

const cachedGroups: groupT[] = [];

const _layout = () => {
  const { setUserLocation, user, setUser, myGroups, setMyGroups } =
    useAppContext().userMethods;
  const [
    postgresChangesRegistrationStatus,
    setPostgresChangesRegistrationStatus,
  ] = useState<boolean | undefined>(undefined);

  // get the user location and set it in the context
  useEffect(() => {
    getUserLocation()
      .then((location) => setUserLocation(location?.coords ?? undefined))
      .catch((err) => {
        console.error("Error getting user location:", err);
      });

    // setInterval(() => {
    //   console.log({ postgresChangesRegistrationStatus });

    //   postgresChangesRegistrationStatus === false &&
    //     postgresChangesChannel.unsubscribe().then(() => {
    //       console.log("Retrying real time subscription");
    //       setPostgresChangesRegistrationStatus(undefined);
    //     });
    // }, 5000);
  }, []);

  useEffect(() => {
    postgresChangesRegistrationStatus === undefined &&
      registerToPostgresChanges(
        (payload) => {
          console.log({ payload });
          try {
            if (payload.table === tables.users) {
              const schema = usersSchema;
              if (payload.new) {
                const newUser = schema.parse(payload.new);
                if (newUser.id === user?.id) {
                  setUser(newUser);
                }
              }
            } else if (payload.table === tables.groups) {
              switch (payload.eventType) {
                case "DELETE":
                  setMyGroups((prev) => {
                    delete prev[payload.old.id];
                    return { ...prev };
                  });
                  break;

                default:
                  setUser((prev) => (prev ? { ...prev } : prev));
                  break;
              }
            } else if (payload.table === tables.group_members) {
              setUser((prev) => (prev ? { ...prev } : prev));
            }
          } catch (error) {
            unknownErrorHandler(error);
          }
        },
        (registered) => {
          setPostgresChangesRegistrationStatus(registered);
        }
      );

    return () => {
      // postgresChangesChannel.unsubscribe().then(() => {
      //   setPostgresChangesRegistrationStatus(undefined);
      // });
    };
  }, [postgresChangesRegistrationStatus]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: primaryColors["--color-primary-950"],
        },
        // headerStyle: {
        //   backgroundColor: primaryColors["--color-primary-950"],
        // },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon({ focused }) {
            return (
              <Icon
                className={focused ? "text-primary-600" : "text-typography-600"}
                as={LayoutDashboard}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ focused }) => {
            return (
              <Box
                className={`${
                  focused ? " w-20" : "w-12"
                }  aspect-square rounded-full relative ${
                  focused ? "-top-6" : "-top-3"
                } `}
              >
                <Gradient
                  className="w-full h-full rounded-full overflow-hidden"
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0.4, y: 0 }}
                >
                  <Center className="w-full h-full">
                    {user?.is_agent ? (
                      <Icon className=" text-typography-0" as={Siren} />
                    ) : (
                      <Heading
                        size={focused ? "md" : "xs"}
                        className=" text-typography-200"
                      >
                        SOS
                      </Heading>
                    )}
                  </Center>
                </Gradient>
              </Box>
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Settings",
          tabBarIcon({ focused }) {
            return (
              <Icon
                className={focused ? "text-primary-600" : "text-typography-600"}
                as={Settings}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default _layout;
