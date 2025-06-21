import { useAppContext } from "@/components/context/AppContextProvider";
import Gradient from "@/components/Gradient";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { primaryColors } from "@/constants";
import { getUserLocation } from "@/utils";
import { Tabs } from "expo-router";
import { LayoutDashboard, Settings } from "lucide-react-native";
import React, { useEffect } from "react";

const _layout = () => {
  const { setUserLocation } = useAppContext().userMethods;
  // get the user location and set it in the context
  useEffect(() => {
    getUserLocation()
      .then((location) => setUserLocation(location?.coords ?? undefined))
      .catch((err) => {
        console.error("Error getting user location:", err);
      });
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
                    <Heading
                      size={focused ? "md" : "xs"}
                      className=" text-typography-200"
                    >
                      SOS
                    </Heading>
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
