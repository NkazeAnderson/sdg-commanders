import MapAvatar from "@/components/MapAvatar";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { DrawerContent } from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MapView, { MapMarker } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const AnimatedDrawerContent = Animated.createAnimatedComponent(DrawerContent);
const Home = () => {
  const [showDrawer, setshowDrawer] = useState(true);
  // useEffect(() => {
  //   Location.requestForegroundPermissionsAsync();
  //   Location.getCurrentPositionAsync().then((res) => {
  //     console.log(res.coords);
  //   });
  // }, []);
  const height = useSharedValue(100);
  const animatedSliderStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });
  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      console.log(e);
    })
    .onUpdate((e) => {
      if (e.translationY > 0) {
        if (height.value !== 0) {
          height.value -= 2;
        }
      } else {
        height.value += 2;
      }
    });
  return (
    <Box className=" flex-1 relative">
      <View className=" flex-1 border relative">
        <MapView
          style={{
            width: "100%",
            height: "100%",
          }}
          showsTraffic
          showsBuildings
        >
          <MapMarker coordinate={{ latitude: 3.8617, longitude: 11.5202 }}>
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
                profilePic:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
              safe={true}
            />
          </MapMarker>
        </MapView>
      </View>
      <View className=" w-full bg-primary-950  border-0  absolute bottom-0 rounded-t-3xl">
        <GestureDetector gesture={panGesture}>
          <View className="px-4 bg-primary-950 py-4 rounded-t-3xl">
            <VStack space="md" className=" items-center w-full">
              <Center>
                <Divider className="w-20 p-1 rounded-full" />
              </Center>
              <Heading className="text-typography-100">Sea Rocket Tech</Heading>
            </VStack>
          </View>
        </GestureDetector>
        <Animated.View
          className="bg-primary-900/10 "
          style={animatedSliderStyles}
        >
          <HStack space="md" className="p-4 bg-primary-800 rounded-md">
            <Avatar size={"lg"}>
              <AvatarFallbackText>""</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                }}
              />
            </Avatar>
            <Box className="gap-1">
              <Heading className=" text-typography-100">John Doe</Heading>
              <Text className=" text-typography-100">
                Last Active 5 hrs ago
              </Text>
            </Box>
          </HStack>
        </Animated.View>
      </View>
    </Box>
  );
};
export default Home;
