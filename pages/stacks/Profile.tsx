import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";

import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { Pen, UserCircle } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
const Profile = () => {
  return (
    <>
      <View className="flex-1 bg-primary-900 px-4 ">
        <Center className="gap-4">
          <Center className="w-36 aspect-square rounded-full bg-primary-200 relative">
            <Icon className="w-20 h-20 text-primary-600" as={UserCircle} />
            <Button
              action={"primary"}
              variant={"solid"}
              size={"md"}
              className="aspect-square rounded-full absolute -bottom-4 -right-16"
              onPress={() => {
                router.push("/stacks/edit-profile");
              }}
            >
              <ButtonIcon as={Pen} />
            </Button>
          </Center>
          <Heading size="xl" className="text-typography-50">
            John Doe
          </Heading>
        </Center>
        <Divider className="my-6 bg-primary-100" />
        <ScrollView>
          <VStack space="lg">
            <Box>
              <Heading className=" text-typography-0">Location</Heading>
              <Text className=" text-typography-300">Douala, Cameroon</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Family</Heading>
              <Text className=" text-typography-300">Kenfack Steve Family</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Role</Heading>
              <Text className=" text-typography-300">Son</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Phone</Heading>
              <Text className=" text-typography-300">+237 677777777</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Emergency Phone</Heading>
              <Text className=" text-typography-300">+237 677777777</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Email</Heading>
              <Text className=" text-typography-300">john.doe@gmail.com</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Account Type</Heading>
              <Text className=" text-typography-300">Individual</Text>
            </Box>
          </VStack>
        </ScrollView>
      </View>
      <Stack.Screen
        options={{
          title: "Profile",
        }}
      />
    </>
  );
};
export default Profile;
