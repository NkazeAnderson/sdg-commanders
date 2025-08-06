import { useAppContext } from "@/components/context/AppContextProvider";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, router, Stack } from "expo-router";
import { CircleUserRound, Coins, Pen } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
const Profile = () => {
  const {
    userMethods: { user, myGroups },
  } = useAppContext();

  const expired = user?.subcriptionExpiration
    ? new Date() > new Date(user.subcriptionExpiration)
    : true;

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
        {!myGroups && (
          <HStack className=" items-center justify-center py-4" space="md">
            <Text className=" text-primary-0">My Subscription:</Text>
            <Text
              bold
              className={`${expired ? " text-error-500" : "text-success-500"}`}
            >
              {expired ? "Expired" : "Active"}
            </Text>
            <Link href={`/stacks/subscriptions?userId=${user?.id}`} asChild>
              <Button size="sm" className=" rounded-full ml-2">
                <ButtonText>Subscribe</ButtonText>
                <ButtonIcon as={Coins} />
              </Button>
            </Link>
          </HStack>
        )}
        <Divider className="my-6 bg-primary-100" />
        <ScrollView>
          <VStack space="lg">
            <Box>
              <Heading className=" text-primary-0">Phone</Heading>
              <Text className=" text-typography-300">+237 {user?.phone}</Text>
            </Box>
            {Boolean(user?.emergency_phone) && (
              <Box>
                <Heading className=" text-primary-0">Emergency Phone</Heading>
                <Text className=" text-typography-300">
                  +237 {user?.emergency_phone}
                </Text>
              </Box>
            )}
            <Box>
              <Heading className=" text-primary-0">Email</Heading>
              <Text className=" text-typography-300">{user?.email}</Text>
            </Box>
            <Box>
              <Heading className=" text-primary-0">Home Address</Heading>
              <Text className=" text-typography-300">{user?.home_address}</Text>
            </Box>
            <Box>
              <Heading className=" text-primary-0">Account Type</Heading>
              <Text className=" text-typography-300">
                {user?.is_agent ? "Agent" : "Client"}
              </Text>
            </Box>
            <Heading className=" text-primary-500">Groups & Families</Heading>
            {myGroups &&
              Object.keys(myGroups).map((item) => {
                const membership = myGroups[item].find(
                  (member) => member.member_id?.id === user?.id
                )!;
                return (
                  <Box key={item} className=" gap-2">
                    <Box>
                      <Heading className=" text-primary-0">
                        {membership.group_id.is_organisation
                          ? "Organisation"
                          : "Family"}
                      </Heading>
                      <Text className=" text-typography-300">
                        {membership.group_id.name}
                      </Text>
                    </Box>
                    <Box>
                      <Heading className=" text-primary-0">My Role</Heading>
                      <Text className=" text-typography-300 capitalize">
                        {membership.role}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
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
