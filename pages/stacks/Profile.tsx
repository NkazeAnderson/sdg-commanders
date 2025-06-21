import { useAppContext } from "@/components/context/AppContextProvider";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";

import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { CircleUserRound, Pen } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
const Profile = () => {
  const {
    userMethods: { user, myGroups },
  } = useAppContext();
  return (
    <>
      <View className="flex-1 bg-primary-900 px-4 ">
        <Center className="gap-4">
          <Center className="w-36 aspect-square rounded-full bg-primary-200 relative">
            {user?.profile_picture ? (
              <Avatar size="2xl">
                <AvatarImage
                  source={{
                    uri: user.profile_picture,
                  }}
                />
              </Avatar>
            ) : (
              <Icon
                className="w-20 h-20 text-primary-600"
                as={CircleUserRound}
              />
            )}
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
          <Heading size="xl" className="text-typography-50 capitalize">
            {user?.name}
          </Heading>
        </Center>
        <Divider className="my-6 bg-primary-100" />
        <ScrollView>
          <VStack space="lg">
            {myGroups &&
              Object.keys(myGroups).map((item) => {
                const membership = myGroups[item].find(
                  (member) => member.member_id?.id === user?.id
                )!;
                return (
                  <Box key={item}>
                    <Box>
                      <Heading className=" text-typography-0">
                        {membership.group_id.is_organisation
                          ? "Organisation"
                          : "Family"}
                      </Heading>
                      <Text className=" text-typography-300">
                        {membership.group_id.name}
                      </Text>
                    </Box>
                    <Box>
                      <Heading className=" text-typography-0">Role</Heading>
                      <Text className=" text-typography-300 capitalize">
                        {membership.role}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            <Box>
              <Heading className=" text-typography-0">Phone</Heading>
              <Text className=" text-typography-300">+237 {user?.phone}</Text>
            </Box>
            {Boolean(user?.emergency_phone) && (
              <Box>
                <Heading className=" text-typography-0">
                  Emergency Phone
                </Heading>
                <Text className=" text-typography-300">
                  +237 {user?.emergency_phone}
                </Text>
              </Box>
            )}
            <Box>
              <Heading className=" text-typography-0">Email</Heading>
              <Text className=" text-typography-300">{user?.email}</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Home Address</Heading>
              <Text className=" text-typography-300">{user?.home_address}</Text>
            </Box>
            <Box>
              <Heading className=" text-typography-0">Account Type</Heading>
              <Text className=" text-typography-300">
                {user?.is_agent ? "Agent" : "Individual"}
              </Text>
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
