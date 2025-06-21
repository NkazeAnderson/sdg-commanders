import { useAppContext } from "@/components/context/AppContextProvider";
import GroupMembersList from "@/components/GroupMembersList";
import MapAvatar from "@/components/MapAvatar";

import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { DrawerContent } from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const AnimatedDrawerContent = Animated.createAnimatedComponent(DrawerContent);
const Home = () => {
  const [showDrawer, setshowDrawer] = useState(true);
  const {
    userMethods: { userLocation, user, myGroups },
  } = useAppContext();
  const mapRef = useRef<MapView>(null);
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

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        2000
      );
    }
  }, [userLocation]);

  const groupsKeys = !myGroups ? [] : Object.keys(myGroups);

  return (
    <Box className=" flex-1 relative">
      <View className=" flex-1 border relative">
        <MapView
          style={{
            width: "100%",
            height: "100%",
          }}
          ref={mapRef}
          showsTraffic
          showsBuildings
          provider={PROVIDER_GOOGLE}
        >
          {userLocation && (
            <MapMarker coordinate={userLocation}>
              <MapAvatar user={user!} safe={true} />
            </MapMarker>
          )}
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
          <Heading size="md" className=" text-typography-100 p-2">
            Members
          </Heading>
          <ScrollView showsVerticalScrollIndicator={false} className=" flex-1 ">
            {Boolean(groupsKeys.length) && myGroups && (
              <ScrollView>
                {groupsKeys.map((item) => {
                  const members = myGroups[item];
                  return <GroupMembersList key={item} members={members} />;
                })}
              </ScrollView>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Box>
  );
};
export default Home;
