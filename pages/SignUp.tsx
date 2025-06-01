import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";

import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { userModes } from "@/constants";
import { userModesT } from "@/types";
import { Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SignUp = () => {
  const { control } = useForm();
  const [userMode, setUserMode] = useState<userModesT>(userModes[0]);

  function changeMode(index: number) {
    setUserMode(userModes[index]);
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="px-4 flex-1 bg-primary-900/90"
    >
      <SafeAreaView className="flex-1">
        <Center className=" items-stretch">
          <VStack space="md" className=" items-center">
            <Heading size="2xl" className=" text-primary-100">
              Sign Up
            </Heading>
            <Box className=" w-1/4">
              <Divider className="bg-background-400 " />
            </Box>
            <Text className="py-2 text-typography-100">Join As</Text>
          </VStack>
        </Center>
        <HStack>
          <Button
            className={`flex-1 rounded-l-xl rounded-r-none ${
              userMode === userModes[0]
                ? "bg-primary-600 elevation-lg"
                : " bg-primary-800"
            }`}
            onPress={() => {
              changeMode(0);
            }}
          >
            <ButtonText>{userModes[0]}</ButtonText>
          </Button>
          <Button
            className={`px-6 rounded-none border-x border-background-100 ${
              userMode === userModes[1]
                ? "bg-primary-600 elevation-lg"
                : " bg-primary-800"
            }`}
            onPress={() => {
              changeMode(1);
            }}
          >
            <ButtonText>{userModes[1]}</ButtonText>
          </Button>
          <Button
            className={`flex-1 rounded-r-xl rounded-l-none ${
              userMode === userModes[2]
                ? "bg-primary-600 elevation-lg"
                : " bg-primary-800"
            }`}
            onPress={() => {
              changeMode(2);
            }}
          >
            <ButtonText>{userModes[2]}</ButtonText>
          </Button>
        </HStack>
        <ScrollView>
          <Form className="py-6">
            <Input
              control={control}
              name="name"
              label="Name"
              placeholder="Your name"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="email"
              label="Email"
              placeholder="Your email"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="phone"
              label="Phone"
              placeholder="Your phone"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="address"
              label="Address"
              placeholder="Your address"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="address"
              label="Address"
              placeholder="Your address"
              labelClassName="text-typography-100"
            />
          </Form>
          <HStack space="md" className=" justify-start py-3">
            <Checkbox size={"md"} value="checkbox-id">
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
            </Checkbox>
            <Box className="w-10/12">
              <Text className=" text-typography-400">
                By signing up, you agree to our{" "}
                <Link className="text-primary-600" href={"/"}>
                  Privacy
                </Link>{" "}
                and{" "}
                <Link className="text-primary-600" href={"/"}>
                  Terms of service
                </Link>
              </Text>
            </Box>
          </HStack>
          <VStack space="md" className="py-10 justify-end">
            <Gradient className="rounded-md">
              <Button size="lg" className="bg-transparent">
                <ButtonText>Sign Up</ButtonText>
                <ButtonIcon as={ArrowRight} />
              </Button>
            </Gradient>
            <Text className=" text-typography-400 text-center">
              {" "}
              Already have an account?{" "}
              <Link href={"/login"} className=" text-primary-900 font-bold">
                Sign In
              </Link>{" "}
            </Text>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default SignUp;
