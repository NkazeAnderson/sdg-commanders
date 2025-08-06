import { useAppContext } from "@/components/context/AppContextProvider";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/supabase";
import { Link } from "expo-router";
import {
  ChevronRight,
  CircleUserRound,
  Copy,
  DollarSign,
  FileText,
  LogOut,
  MessageCircleQuestion,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import { Share, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Account = () => {
  const {
    userMethods: { user },
  } = useAppContext();
  const [loggingOut, setLoggingOut] = useState(false);
  function logOut() {
    setLoggingOut(true);
    supabase.auth.signOut().then(() => {
      setLoggingOut(false);
    });
  }
  return (
    <Box className="flex-1 bg-primary-950">
      <SafeAreaView className="px-4">
        <HStack space="md" className=" items-center">
          <Avatar size={"lg"}>
            <AvatarFallbackText>{user?.name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user?.profile_picture ?? undefined,
              }}
            />
            {<AvatarBadge />}
          </Avatar>
          <Box>
            <Heading className="capitalize text-typography-300">
              {user?.name}
            </Heading>
            <HStack space="md" className=" items-center">
              <Text className="text-typography-400">{`${
                user?.id.split("-")[0]
              }...`}</Text>
              <Button
                variant="link"
                onPress={() => {
                  Share.share({ message: user?.id!, title: "SGK ID" });
                }}
              >
                <ButtonIcon as={Copy} />
              </Button>
            </HStack>
          </Box>
        </HStack>
        <Divider className="my-4" />
        <VStack>
          <Link href={"/stacks/profile"} asChild>
            <TouchableOpacity>
              <HStack space="md" className=" items-center justify-between py-4">
                <HStack space="xl" className="items-center ">
                  <Icon
                    className="text-primary-600 w-8 h-8"
                    as={CircleUserRound}
                  />
                  <Text size="lg" className="text-typography-100 font-medium ">
                    Profile
                  </Text>
                </HStack>
                <Icon className="text-typography-400" as={ChevronRight} />
              </HStack>
            </TouchableOpacity>
          </Link>
          <Link href={"/stacks/members"} asChild>
            <TouchableOpacity>
              <HStack space="md" className=" items-center justify-between py-4">
                <HStack space="xl" className="items-center ">
                  <Icon className="text-primary-600 w-8 h-8" as={Users} />
                  <Text size="lg" className="text-typography-100 font-medium ">
                    Groups & Families
                  </Text>
                </HStack>
                <Icon className="text-typography-400" as={ChevronRight} />
              </HStack>
            </TouchableOpacity>
          </Link>
          <Link href={"/stacks/subscriptions"} asChild>
            <TouchableOpacity>
              <HStack space="md" className=" items-center justify-between py-4">
                <HStack space="xl" className="items-center ">
                  <Icon className="text-primary-600 w-8 h-8" as={DollarSign} />
                  <Text size="lg" className="text-typography-100 font-medium ">
                    Subscriptions
                  </Text>
                </HStack>
                <Icon className="text-typography-400" as={ChevronRight} />
              </HStack>
            </TouchableOpacity>
          </Link>
          <Link href={"/stacks/payment-history"} asChild>
            <TouchableOpacity>
              <HStack space="md" className=" items-center justify-between py-4">
                <HStack space="xl" className="items-center ">
                  <Icon className="text-primary-600 w-8 h-8" as={FileText} />
                  <Text size="lg" className="text-typography-100 font-medium ">
                    Payment history
                  </Text>
                </HStack>
                <Icon className="text-typography-400" as={ChevronRight} />
              </HStack>
            </TouchableOpacity>
          </Link>
          <Link href={"/stacks/messages"} asChild>
            <TouchableOpacity>
              <HStack space="md" className=" items-center justify-between py-4">
                <HStack space="xl" className="items-center ">
                  <Icon
                    className="text-primary-600 w-8 h-8"
                    as={MessageCircleQuestion}
                  />
                  <Text size="lg" className="text-typography-100 font-medium ">
                    Contact Support
                  </Text>
                </HStack>
                <Icon className="text-typography-400" as={ChevronRight} />
              </HStack>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity onPress={logOut}>
            <HStack space="md" className=" items-center justify-between py-4">
              <HStack space="xl" className="items-center ">
                <Icon className="text-primary-600 w-8 h-8" as={LogOut} />
                <Text size="lg" className="text-typography-100 font-medium ">
                  {loggingOut ? "Signing Out..." : "Sign Out"}
                </Text>
              </HStack>
              <Icon className="text-typography-400" as={ChevronRight} />
            </HStack>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
    </Box>
  );
};
export default Account;
