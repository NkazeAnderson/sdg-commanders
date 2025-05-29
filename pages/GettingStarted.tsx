import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { remoteImages } from "@/constants/mockData";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
const GettingStarted = () => {
  const [width, setwidth] = useState(0);
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setRotation((prev) => prev + 10);
    }, 2000);
    return () => {};
  }, []);

  return (
    <Box className=" flex flex-1 bg-background-50">
      <Image
        source={require("@/assets/images/contours.png")}
        alt="contours"
        size="full"
        className=" absolute w-full h-full"
      />
      <Box className=" flex flex-1 p-12">
        <Avatar
          size={"lg"}
          className="bg-background-600 border-2 border-red-600"
        >
          <AvatarFallbackText>""</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: remoteImages[0],
            }}
          />
        </Avatar>

        <Box
          className="relative self-start "
          onLayout={(e) => {
            setwidth(e.nativeEvent.layout.width);
          }}
        >
          <Center className="absolute" style={{ width: width }}>
            <Avatar size={"lg"} className="bg-background-600 border-2 ">
              <AvatarFallbackText>""</AvatarFallbackText>
              <AvatarImage
                source={require("@/assets/images/sdg-officer.png")}
              />
            </Avatar>
          </Center>

          <HStack
            className=" self-start relative items-center"
            style={{ transform: [{ rotate: `${rotation}deg` }] }}
          >
            <Avatar size={"sm"} className="bg-transparent "></Avatar>
            <Avatar size={"lg"} className="bg-transparent "></Avatar>
            <Avatar size={"sm"} className="bg-transparent ">
              <Icon className=" text-primary-600 " as={ArrowRightIcon} />
            </Avatar>
          </HStack>
        </Box>
      </Box>

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
    </Box>
  );
};
export default GettingStarted;
