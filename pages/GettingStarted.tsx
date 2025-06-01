import Gradient from "@/components/Gradient";
import Logo from "@/components/Logo";
import MapAvatar from "@/components/MapAvatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { getStartedTexts } from "@/constants";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
const AnimatedDrawerContent = Animated.createAnimatedComponent(DrawerContent);

const GettingStarted = () => {
  const [activeHeadingTextIndex, setActiveHeadingTextIndex] = useState<{
    index: number;
  }>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [showDrawer, setshowDrawer] = useState(false);
  const height = useSharedValue(100);
  const headingTextFlatlistRef = useRef<FlatList>(null);

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      console.log(e);
    })
    .onUpdate((e) => {
      console.log(e.translationY);
      if (e.translationY > 0) {
        height.value -= 1;
      } else {
        height.value += 1;
      }
    });

  // const changeIndex = useCallback(() => {
  //   let currentvalue = 0;
  //   setActiveHeadingTextIndex((prev) => {
  //     currentvalue = prev + 1;
  //     return prev + 1;
  //   });
  //   if (headingTextFlatlistRef.current) {
  //     headingTextFlatlistRef.current.scrollToIndex({
  //       index: currentvalue + 1,
  //     });
  //   }
  // }, [activeHeadingTextIndex]);

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
          <Box
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
                profilePic:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
              safe={false}
            />
          </Box>
          <Box
            className="absolute"
            style={{
              transform: [
                { translateX: windowWidth - 25 },
                { translateY: windowHeight / 2 + 100 },
              ],
            }}
          >
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
              }}
            />
          </Box>
          <Box
            className="absolute"
            style={{
              transform: [{ translateX: 50 }, { translateY: 50 }],
            }}
          >
            <MapAvatar
              user={{
                name: "Wale",
                id: "7776777",
              }}
            />
          </Box>
        </Box>

        <VStack className="flex-1 justify-between">
          <Center className="py-20">
            <Logo />
            <Heading className="text-cyan-100 uppercase " size="xl">
              SDG
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
      <Drawer isOpen={showDrawer} size="sm" anchor="bottom">
        <AnimatedDrawerContent
          className="rounded-3xl bg-primary-950  border-0 px-0"
          style={{
            height,
          }}
        >
          <GestureDetector gesture={panGesture}>
            <DrawerHeader className="px-4 bg-primary-950">
              <VStack space="md" className=" items-center w-full">
                <Center>
                  <Divider className="w-20 p-1 rounded-full" />
                </Center>
                <Heading className="text-typography-100">
                  Sea Rocket Tech
                </Heading>
              </VStack>
            </DrawerHeader>
          </GestureDetector>
          <DrawerBody className="bg-primary-900/10">
            <Text>Drawer</Text>
          </DrawerBody>
        </AnimatedDrawerContent>
      </Drawer>
    </Box>
  );
};
export default GettingStarted;
