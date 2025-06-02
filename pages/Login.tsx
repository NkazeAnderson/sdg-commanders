import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import { ArrowLeft, Lock, LockOpen } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const steps = ["credential", "code"] as const;

const Login = () => {
  const { control, watch, setValue } = useForm<{ phone: string; code: string }>(
    {
      defaultValues: { code: "" },
    }
  );
  const [step, setStep] = useState(0);

  const code = watch("code");

  useEffect(() => {
    if (code.length > 4) {
      setValue("code", "");
    }
  }, [code]);

  useEffect(() => {
    flatListRef &&
      flatListRef.current?.scrollToIndex({
        index: step,
        animated: true,
      });
  }, [step]);

  const flatListRef = useRef<FlatList>(null);

  function changeStep() {
    setStep(!step ? 1 : 0);
  }

  function confirmCode() {
    router.push("/tabs");
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-primary-900/90"
    >
      <SafeAreaView className="flex-1">
        <Center className=" items-stretch">
          <VStack space="md" className=" items-center">
            <Heading size="2xl" className=" text-primary-100">
              Sign In
            </Heading>
            <Box className=" w-1/4">
              <Divider className="bg-background-400 " />
            </Box>
            <Logo />
          </VStack>
        </Center>

        <Box>
          <FlatList
            ref={flatListRef}
            data={steps}
            renderItem={({ item }) => {
              if (item === "credential") {
                return (
                  <Form space="2xl" className="pb-10 pt-20 px-4 w-[100vw]">
                    <Input
                      control={control}
                      name="phone"
                      label="Phone"
                      placeholder="Your phone"
                      labelClassName="text-typography-100"
                    />
                    <Gradient className="rounded-md">
                      <Button
                        size="lg"
                        className="bg-transparent"
                        onPress={changeStep}
                      >
                        <ButtonText>Sign In</ButtonText>
                        <ButtonIcon as={Lock} />
                      </Button>
                    </Gradient>
                  </Form>
                );
              } else {
                return (
                  <Form space="2xl" className="pb-10 pt-20 px-4 w-[100vw]">
                    <Box className="relative ">
                      <HStack space="md" className="px-[10%] ">
                        {["", "", "", ""].map((item, index) => (
                          <Box
                            key={index}
                            className=" border-2 rounded-lg flex-1 flex items-center justify-center aspect-square border-primary-900 bg-background-100"
                          >
                            <Heading size="2xl" className=" leading-none">
                              {code[index] ?? ""}
                            </Heading>
                          </Box>
                        ))}
                      </HStack>
                      <Box className="absolute top-1/4 w-full ">
                        <Input
                          control={control}
                          inputClassName=" text-transparent !caret-transparent  cursor-transparent !bg-transparent !border-transparent !outline-none"
                          name="code"
                          selectionColor={"transparent"}
                          keyboardType="number-pad"
                        />
                      </Box>
                    </Box>
                    <Gradient className="rounded-md mt-10">
                      <Button
                        onPress={confirmCode}
                        size="lg"
                        className="bg-transparent"
                      >
                        <ButtonText>Confirm Code</ButtonText>
                        <ButtonIcon as={LockOpen} />
                      </Button>
                    </Gradient>
                    <Button
                      size="sm"
                      className="bg-transparent"
                      variant="link"
                      onPress={changeStep}
                    >
                      <ButtonIcon as={ArrowLeft} />
                      <ButtonText>Go Back</ButtonText>
                    </Button>
                  </Form>
                );
              }
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled={false}
          />

          <HStack space="sm" className="py-5 justify-center items-center">
            <Text className=" text-typography-400 text-center py-7">
              No account yet?
            </Text>
            <Link href={"/signup"} asChild>
              <Button variant="link">
                <ButtonText>Sign up</ButtonText>
              </Button>
            </Link>
          </HStack>
        </Box>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default Login;
