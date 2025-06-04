import { Trash } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";
import { Button, ButtonIcon } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";

const MemberCard = ({ manage, role }: { manage?: boolean; role: string }) => {
  return (
    <HStack
      space="sm"
      className=" items-center justify-between p-4 bg-primary-800 rounded-md"
    >
      <HStack space="md" className=" items-center">
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
            {role && manage ? role : "Last Active 5 hrs ago"}
          </Text>
        </Box>
      </HStack>
      {manage && (
        <HStack space="sm">
          <Button size="sm" action="negative">
            <ButtonIcon as={Trash} />
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export default MemberCard;
