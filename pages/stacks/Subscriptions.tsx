import Gradient from "@/components/Gradient";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";

const Subscriptions = () => {
  return (
    <ScrollView className=" flex-1 bg-primary-950 p-4 gap-4">
      <HStack className=" items-center my-2">
        <Heading size="lg" className="text-primary-500">
          Current Plan:{" "}
        </Heading>
        <Text className="text-typography-50">Personal</Text>
      </HStack>
      <Box className=" relative bg-primary-200  rounded-lg p-2 my-4">
        <Gradient
          className="overflow-hidden rounded-full "
          start={{ x: 0, y: 1 }}
          end={{ x: 0.4, y: 0 }}
        >
          <VStack space="xl" className=" items-center relative p-6">
            <Image
              className=" w-10 h-10"
              source={require("@/assets/images/person.png")}
              alt="icon"
            />
            <Heading className="text-primary-50" size="2xl">
              Personal
            </Heading>
            <HStack space="sm" className=" items-end">
              <Heading className=" text-primary-500" size="lg">
                3500
              </Heading>
              <Text className=" text-typography-50">/month</Text>
            </HStack>
            <HStack space="md" className=" items-center">
              <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
              <Text className=" text-typography-50">1 Principal account</Text>
            </HStack>
            <Button>
              <ButtonText>Select</ButtonText>
            </Button>
          </VStack>
        </Gradient>
      </Box>
      <Box className=" relative bg-primary-200  rounded-lg p-2 my-4">
        <Gradient
          className="overflow-hidden rounded-full "
          start={{ x: 0, y: 1 }}
          end={{ x: 0.4, y: 0 }}
        >
          <VStack space="xl" className=" items-center relative p-6">
            <Image
              className=" w-10 h-10"
              source={require("@/assets/images/family.png")}
              alt="icon"
            />
            <Heading className="text-primary-50" size="2xl">
              Family
            </Heading>
            <HStack space="sm" className=" items-end">
              <Heading className=" text-primary-500" size="lg">
                5000
              </Heading>
              <Text className=" text-typography-50">/month</Text>
            </HStack>
            <HStack space="md" className=" items-center">
              <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
              <Text className=" text-typography-50">1 Principal account</Text>
            </HStack>
            <HStack space="md" className=" items-center">
              <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
              <Text className=" text-typography-50">3 Sub accounts</Text>
            </HStack>
            <Button>
              <ButtonText>Select</ButtonText>
            </Button>
          </VStack>
        </Gradient>
      </Box>
      <Box className=" relative bg-primary-200  rounded-lg p-2 my-4">
        <Gradient
          className="overflow-hidden rounded-full "
          start={{ x: 0, y: 1 }}
          end={{ x: 0.4, y: 0 }}
        >
          <VStack space="xl" className=" items-center relative p-6">
            <Image
              className=" w-10 h-10"
              source={require("@/assets/images/crowd.png")}
              alt="icon"
            />
            <Heading className="text-primary-50" size="2xl">
              Extended family
            </Heading>
            <HStack space="sm" className=" items-end">
              <Heading className=" text-primary-500" size="lg">
                7000
              </Heading>
              <Text className=" text-typography-50">/month</Text>
            </HStack>
            <HStack space="md" className=" items-center">
              <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
              <Text className=" text-typography-50">1 Principal account</Text>
            </HStack>
            <HStack space="md" className=" items-center">
              <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
              <Text className=" text-typography-50">10 Sub accounts</Text>
            </HStack>
            <Button>
              <ButtonText>Select</ButtonText>
            </Button>
          </VStack>
        </Gradient>
      </Box>
    </ScrollView>
  );
};

export default Subscriptions;
