import { useAppContext } from "@/components/context/AppContextProvider";
import Gradient from "@/components/Gradient";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { primaryColors, tables } from "@/constants";
import { getGroupMember, groupMembersJoinedSchemaT } from "@/supabase/groups";
import {
  postgresChangesChannel,
  registerToPostgresChanges,
} from "@/supabase/realtime";
import { groupT } from "@/types";
import { getUserLocation } from "@/utils";
import { groupMembersSchema, usersSchema } from "@/zodSchema";
import { Tabs } from "expo-router";
import { LayoutDashboard, Settings, Siren } from "lucide-react-native";
import React, { useEffect, useRef } from "react";

const cachedGroups: groupT[] = [];

const _layout = () => {
  const { setUserLocation, user, setUser, myGroups, setMyGroups } =
    useAppContext().userMethods;
  const postgresChangesRegistrationStatus = useRef(false);
  // get the user location and set it in the context
  useEffect(() => {
    getUserLocation()
      .then((location) => setUserLocation(location?.coords ?? undefined))
      .catch((err) => {
        console.error("Error getting user location:", err);
      });
    postgresChangesRegistrationStatus.current === false &&
      registerToPostgresChanges(
        (payload) => {
          console.log(payload);

          if (payload.table === tables.users) {
            const schema = usersSchema;
            if (payload.new) {
              const newUser = schema.parse(payload.new);
              if (newUser.id === user?.id) {
                setUser(newUser);
              }
            }
          } else if (payload.table === tables.group_members) {
            if (payload.new) {
              const member = groupMembersSchema.parse(payload.new);
              getGroupMember(member.id!)
                .then((res) => {
                  console.log(res);

                  if (res.data && !Array.isArray(res.data)) {
                    setMyGroups((prev) => {
                      if (prev && prev[member.group_id]) {
                        const index = prev[member.group_id].findIndex(
                          (item) => item.member_id?.id === member.member_id
                        );
                        if (index >= 0) {
                          prev[member.group_id][index] =
                            res.data as groupMembersJoinedSchemaT;
                        } else {
                          prev[member.group_id].push(
                            res.data as groupMembersJoinedSchemaT
                          );
                        }
                      } else {
                        prev[member.group_id] = [
                          res.data as groupMembersJoinedSchemaT,
                        ];
                      }
                      return { ...prev };
                    });
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          }
        },
        (registered) => {
          postgresChangesRegistrationStatus.current = registered;
        }
      );

    return () => {
      postgresChangesChannel.unsubscribe().then(() => {
        postgresChangesRegistrationStatus.current = false;
      });
    };
  }, []);

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
