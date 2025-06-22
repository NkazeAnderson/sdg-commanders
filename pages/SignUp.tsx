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
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { userModes } from "@/constants";
import { supabase } from "@/supabase";
import { userModesT } from "@/types";
import { hookFormErrorHandler } from "@/utils";
import { usersSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
const schema = usersSchema.omit({ id: true });
const SignUp = () => {
  const { phone, groupId } = useLocalSearchParams<{
    phone?: string;
    groupId?: string;
  }>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phone: phone ? parseInt(phone) : undefined },
  });
  const [userMode, setUserMode] = useState<userModesT>(userModes[0]);
  const password = "123456789"; //Math.random().toString(36).slice(-8); // Generate a random password
  function changeMode(index: number) {
    setUserMode(userModes[index]);
  }
  // useEffect(() => {
  //   supabase.auth
  //     .signInWithOtp({
  //       phone: "237683403750",
  //     })
  //     .then((res) => console.log(res))
  //     .catch((e) => console.log(e));
  // }, []);

  const subbmitForm = async (data: z.infer<typeof schema>) => {
    const { data: dataRes, error } = await supabase.auth.signInWithOtp({
      phone: `237${data.phone}`,
      options: { shouldCreateUser: true, data },
    });
    console.log({ dataRes, error });

    if (!error) {
      router.push(`/login?phone=${data.phone}`);
      reset();
    }
    // if (dataRes.user) {
    //   const { error } = await supabase
    //     .from(tables.users)
    //     .insert({ ...data, id: dataRes.user.id });
    //   console.log({ error });
    // }
  };

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
            {/* <Text className="py-2 text-typography-100">Join As</Text> */}
          </VStack>
        </Center>
        {/* <HStack>
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
        </HStack> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Form className="py-6">
            <Input
              control={control}
              name="name"
              label="Name"
              placeholder="Your name"
              labelClassName="text-typography-100"
              errors={errors}
            />
            <Input
              control={control}
              name="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              labelClassName="text-typography-100"
              errors={errors}
            />
            <Input
              control={control}
              name="phone"
              label="Phone"
              placeholder="677777777"
              labelClassName="text-typography-100"
              keyboardType="number-pad"
              errors={errors}
            />
            <Input
              control={control}
              name="home_address"
              label="Home Address"
              placeholder="Your home address"
              labelClassName="text-typography-100"
              errors={errors}
            />
          </Form>
          <HStack space="md" className=" justify-start py-3">
            <Checkbox
              size={"md"}
              value="checkbox-id"
              onChange={(value) => setValue("accepted_terms", value)}
            >
              <CheckboxIndicator
                className={`${errors.accepted_terms && "!border-red-500"}`}
              >
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
              <Button
                size="lg"
                className={"bg-transparent"}
                disabled={isSubmitting}
                onPress={handleSubmit(subbmitForm, hookFormErrorHandler)}
              >
                <ButtonText>Sign Up</ButtonText>
                {isSubmitting ? (
                  <ButtonSpinner />
                ) : (
                  <ButtonIcon as={ArrowRight} />
                )}
              </Button>
            </Gradient>
            <Text className=" text-typography-400 text-center">
              {" "}
              Already have an account?{" "}
              <Link href={"/login"} className=" text-black font-bold">
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
