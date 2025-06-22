import Gradient from "@/components/Gradient";
import Logo from "@/components/Logo";
import MapAvatar from "@/components/MapAvatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { getStartedTexts } from "@/constants";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type demoUserT = {
  id: string;
  isAgent: boolean;
  x: number;
  y: number;
  isSafe?: boolean;
};

const GettingStarted = () => {
  const [activeHeadingTextIndex, setActiveHeadingTextIndex] = useState<{
    index: number;
  }>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const headingTextFlatlistRef = useRef<FlatList>(null);
  const [userIsSafe, setUserIsSafe] = useState<boolean>();

  const originalLocations: demoUserT[] = [
    {
      id: "1",
      isAgent: false,
      x: windowWidth / 2 - 20,
      y: windowHeight / 2 - 20,
      isSafe: true,
    },
    { id: "2", isAgent: true, x: windowWidth - 25, y: windowHeight / 2 + 100 },
    { id: "3", isAgent: true, x: 50, y: 50 },
  ];

  const shared = useSharedValue<demoUserT[]>([...originalLocations]);

  const agent1styles = useAnimatedStyle(() => ({
    transform: [
      { translateX: shared.value[1].x },
      { translateY: shared.value[1].y },
    ],
  }));
  const agent2styles = useAnimatedStyle(() => ({
    transform: [
      { translateX: shared.value[2].x },
      { translateY: shared.value[2].y },
    ],
  }));

  function startSOS() {
    "worklet";
    shared.value[1].x = withTiming(shared.value[0].x, { duration: 4000 });
    shared.value[1].y = withTiming(shared.value[0].y, { duration: 4000 });
    shared.value[2].x = withTiming(shared.value[0].x, { duration: 6000 });
    shared.value[2].y = withTiming(
      shared.value[0].y,
      { duration: 6000 },
      () => {
        runOnJS(setUserIsSafe)(true);
        shared.value[1].x = withTiming(shared.value[0].x + 150, {
          duration: 2000,
        });
        shared.value[1].y = withTiming(shared.value[0].y + 100, {
          duration: 2000,
        });
        shared.value[2].x = withTiming(shared.value[0].x - 100, {
          duration: 3000,
        });
        shared.value[2].y = withTiming(shared.value[0].y - 300, {
          duration: 3000,
        });
        shared.value = [...shared.value];
      }
    );
    shared.value = [...shared.value];
  }

  useEffect(() => {
    setTimeout(() => {
      setUserIsSafe(false);
      runOnUI(startSOS)();
    }, 3000);
  }, []);

  useEffect(() => {
    headingTextFlatlistRef.current &&
      activeHeadingTextIndex &&
      headingTextFlatlistRef.current?.scrollToIndex({
        index:
          activeHeadingTextIndex.index == getStartedTexts.length - 1
            ? 0
            : activeHeadingTextIndex.index + 1,
      });
    return () => {};
  }, [activeHeadingTextIndex]);
  return (
    <Box className=" flex flex-1 bg-background-50">
      <Image
        source={require("@/assets/images/contours.png")}
        alt="contours"
        size="full"
        className=" absolute w-full h-full"
      />
      <SafeAreaView className=" flex-1 relative">
        <Box className=" absolute w-full h-full border  py-12">
          <Animated.View
            className="absolute"
            style={{
              transform: [
                { translateX: windowWidth / 2 - 20 },
                { translateY: windowHeight / 2 - 20 },
              ],
            }}
          >
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
                profile_picture:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                email: "",
                home_address: "",
                accepted_terms: false,
                phone: 888,
              }}
              safe={userIsSafe}
            />
          </Animated.View>

          <Animated.View className="absolute" style={agent1styles}>
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
                profile_picture:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                email: "",
                home_address: "",
                accepted_terms: false,
                phone: 888,
                is_agent: true,
              }}
              rotationAngle={userIsSafe ? undefined : 210} // 210}
            />
          </Animated.View>

          <Animated.View className="absolute" style={agent2styles}>
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
                profile_picture:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                email: "",
                home_address: "",
                accepted_terms: false,
                phone: 888,
                is_agent: true,
              }}
              rotationAngle={userIsSafe ? undefined : 60}
            />
          </Animated.View>
        </Box>

        <VStack className="flex-1 justify-between">
          <Center className="py-20">
            <Logo />
            <Heading className="text-cyan-100 uppercase " size="xl">
              SKG
            </Heading>
          </Center>
          <VStack className=" " space="md">
            <FlatList
              data={getStartedTexts}
              ref={headingTextFlatlistRef}
              renderItem={({ item }) => (
                <Box className=" w-[100vw] p-2">
                  <Heading size="3xl" className=" text-center text-white">
                    {item}
                  </Heading>
                </Box>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={(e) => {
                if (e.viewableItems.length === 1) {
                  setTimeout(() => {
                    setActiveHeadingTextIndex(
                      e.viewableItems[0]
                        ? { index: e.viewableItems[0].index as number }
                        : {
                            index: 0,
                          }
                    );
                  }, 5000);
                }
              }}
              onScrollToIndexFailed={(e) => {}}
              scrollEnabled={false}
              pagingEnabled
            />
            <Center>
              <HStack space="sm">
                {getStartedTexts.map((_, index) => {
                  return (
                    <Box
                      key={index}
                      className={`p-1.5 rounded-full ${
                        activeHeadingTextIndex?.index !== index
                          ? "bg-gray-500"
                          : "bg-primary-600"
                      } `}
                    ></Box>
                  );
                })}
              </HStack>
            </Center>
            <Box className=" gap-4 px-4 pb-11">
              <Gradient className=" rounded-md">
                <Link href={"/login"} asChild>
                  <Button size="lg" className=" bg-transparent">
                    <ButtonText>Log In</ButtonText>
                  </Button>
                </Link>
              </Gradient>
              <Gradient className="rounded-md">
                <Link href={"/signup"} asChild>
                  <Button size="lg" className=" bg-transparent">
                    <ButtonText>Sign Up</ButtonText>
                  </Button>
                </Link>
              </Gradient>
            </Box>
          </VStack>
        </VStack>
      </SafeAreaView>
    </Box>
  );
};
export default GettingStarted;
