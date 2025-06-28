import { useAppContext } from "@/components/context/AppContextProvider";
import GroupMembersList from "@/components/GroupMembersList";
import MapAvatar from "@/components/MapAvatar";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { DrawerContent } from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ThreeDotsIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Bell, MessageCircle, Siren } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const AnimatedDrawerContent = Animated.createAnimatedComponent(DrawerContent);
const Home = () => {
  const [showDrawer, setshowDrawer] = useState(true);
  const { height: windowsHeight } = useWindowDimensions();
  const {
    userMethods: { userLocation, user, myGroups, setUserLocation },
    sos,
  } = useAppContext();
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);
  const height = useSharedValue(windowsHeight / 4);
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
      markerRef.current && markerRef.current.forceUpdate();
    }
  }, [userLocation]);

  // useEffect(() => {
  //   setInterval(() => {
  //     setUserLocation((prev) => {
  //       if (prev) {
  //         return { ...prev, latitude: prev.latitude + 0.5 };
  //       }
  //     });
  //   }, 5000);
  // }, []);

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
          <MapMarker
            ref={markerRef}
            coordinate={
              userLocation ?? {
                latitude: 0,
                longitude: 0,
              }
            }
          >
            <MapAvatar user={user!} safe={user?.is_safe ?? undefined} />
            {user?.is_safe === false && (
              <Text size="sm" className="text-red-600">
                Not safe!
              </Text>
            )}
          </MapMarker>
        </MapView>
      </View>
      <View className=" absolute top-12 right-4  ">
        <HStack space="lg" className=" justify-end items-center">
          <Button
            size="lg"
            className=" bg-primary-950 rounded-full aspect-square relative"
          >
            <ButtonIcon as={MessageCircle} />
            <Box className="absolute -right-1 top-0 aspect-square w-3 rounded-full p-0.5 bg-error-700">
              <Text size="xs" className="text-white leading-none text-center">
                1
              </Text>
            </Box>
          </Button>
          <Button
            size="lg"
            className=" bg-primary-950 rounded-full aspect-square"
          >
            <ButtonIcon as={Bell} />
          </Button>
        </HStack>
      </View>
      <View className=" w-full bg-primary-950  border-0  absolute bottom-0 rounded-t-3xl">
        <GestureDetector gesture={panGesture}>
          <View className="px-4 bg-primary-950 py-4 rounded-t-3xl">
            <VStack space="md" className=" items-center w-full">
              <Center>
                <Divider className="w-20 p-1 rounded-full" />
              </Center>

              <Heading className="text-typography-100">SGK Commanders</Heading>
            </VStack>
          </View>
        </GestureDetector>
        <Animated.View
          className="bg-primary-900/10 "
          style={animatedSliderStyles}
        >
          <Heading size="md" className=" text-typography-100 p-2">
            {user?.is_agent ? "SOS List" : "Member Groups"}
          </Heading>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className=" flex-1 py-4"
          >
            {Boolean(groupsKeys.length) && myGroups && !user?.is_agent && (
              <ScrollView>
                {groupsKeys.map((item) => {
                  const members = myGroups[item];
                  return <GroupMembersList key={item} members={members} />;
                })}
              </ScrollView>
            )}
            {user?.is_agent && Boolean(sos.length) && (
              <ScrollView>
                {sos.map((item) => {
                  return (
                    <HStack space="sm" className=" items-center p-2">
                      <Avatar>
                        <AvatarFallbackText>
                          {item.sent_by.name}
                        </AvatarFallbackText>
                        <AvatarImage
                          source={{ uri: item.sent_by.profile_picture ?? "/" }}
                        />
                      </Avatar>
                      <Box className="flex-grow">
                        <Heading className=" text-typography-100 capitalize">
                          {item.sent_by.name}
                        </Heading>
                        <Text size="sm">{item.message}</Text>
                      </Box>
                      <HStack space="sm">
                        <Button action="positive">
                          <ButtonIcon as={Siren} />
                        </Button>
                        <Button>
                          <ButtonIcon as={ThreeDotsIcon} />
                        </Button>
                      </HStack>
                    </HStack>
                  );
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
