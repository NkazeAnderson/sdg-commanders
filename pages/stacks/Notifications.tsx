import { useAppContext } from "@/components/context/AppContextProvider";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { notificationT } from "@/types";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

const Notifications = () => {
  const {
    userMethods: { user },
  } = useAppContext();
  const [notifications, setNotifications] = useState<notificationT[]>([
    {
      id: "1",
      text: "Anthony was rescued in Douala",
      userId: user?.id!,
    },
    {
      id: "2",
      text: "Your son Anthony sent an SOS",
      userId: user?.id!,
    },
  ]);
  return (
    <ScrollView className="flex-1 bg-primary-950 p-4">
      {notifications.map((item) => (
        <Animated.View
          className={"my-1 rounded-lg border-b-2 border-primary-500"}
          key={item.id}
          entering={SlideInRight}
        >
          <HStack className=" p-2 rounded-md items-center bg-primary-800">
            <Box className=" w-12 aspect-square  p-2 rounded-md">
              <Image
                size="full"
                source={require("@/assets/images/sdg-officer.png")}
                alt="image"
              />
            </Box>
            <Box className="bg-primary-800 p-2 rounded-mdf flex-1 ">
              <Box className=" w-full  bg-primary-900 p-2 rounded-md">
                <Text className=" text-primary-200" numberOfLines={2}>
                  {item.text}
                </Text>
              </Box>
            </Box>
          </HStack>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

export default Notifications;
