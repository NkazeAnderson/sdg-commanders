import { userT } from "@/types";
import { Info, Trash } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";
import { Button, ButtonIcon } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";

const MemberCard = ({
  manage,
  role,
  user,
}: {
  manage?: boolean;
  role: string;
  user?: userT;
}) => {
  if (!user) {
    return (
      <HStack>
        <Icon className=" text-warning-100" as={Info} />
        <Text className=" text-typography-200">
          Pending invitation for {role.toLowerCase()}
        </Text>
      </HStack>
    );
  }
  return (
    <HStack
      space="sm"
      className=" items-center justify-between p-4 bg-primary-800 rounded-md"
    >
      <HStack space="md" className=" items-center">
        <Avatar size={"lg"}>
          <AvatarFallbackText>{user.name}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: user.profile_picture ?? "",
            }}
          />
        </Avatar>
        <Box className="gap-1">
          <Heading className=" text-typography-100 capitalize">
            {user.name}
          </Heading>
          <Text className=" text-typography-100">
            {role && manage ? role : user.is_safe ? "All good" : "On SOS"}
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
