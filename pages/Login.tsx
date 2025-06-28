import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
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
import useToast from "@/hooks/useToast";
import { supabase } from "@/supabase";
import { hookFormErrorHandler } from "@/utils";
import { usersSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Lock } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const steps = ["credential", "code"] as const;

const Login = () => {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const phoneForm = useForm({
    defaultValues: phone ? { phone: Number(phone) } : {},
    //@ts-ignore
    resolver: zodResolver(usersSchema.pick({ phone: true })),
  });
  const codeForm = useForm({
    resolver: zodResolver(z.object({ code: z.number() })),
  });
  const [step, setStep] = useState(!phone ? 0 : 1);
  const toast = useToast();
  //const code = codeForm.watch("code");

  useEffect(() => {
    if (code && String(code).length > 6) {
      setCode("");
    }
  }, [code]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current &&
        flatListRef.current.scrollToIndex({
          index: step,
          animated: true,
        });
    }, 500);
  }, [step]);

  const flatListRef = useRef<FlatList>(null);

  function changeStep() {
    if (!phone) {
      phoneForm.handleSubmit(
        async (data) => {
          const res = await supabase.auth.signInWithOtp({
            phone: `237${data.phone}`,
            options: { channel: "sms" },
          });
          if (!res.error) {
            setStep(!step ? 1 : 0);
          } else {
            toast.show({ message: res.error.message, status: "error" });
          }
        },
        (e) => {
          hookFormErrorHandler(e);
        }
      )();
    } else {
      setStep(!step ? 1 : 0);
    }
  }

  async function confirmCode() {
    setPending(true);
    const res = await supabase.auth.verifyOtp({
      phone: `237${phoneForm.getValues("phone")}`,
      token: code,
      type: "sms",
    });
    if (res.error) {
      toast.show({ message: res.error.message, status: "error" });
    } else {
      toast.show({ message: "Successfully logged in" });
    }
    setPending(false);
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
                      control={phoneForm.control}
                      name="phone"
                      label="Phone"
                      placeholder="Your phone"
                      labelClassName="text-typography-100"
                      disabled={Boolean(phone)}
                      keyboardType="number-pad"
                      errors={phoneForm.formState.errors}
                    />
                    <Gradient className="rounded-md">
                      <Button
                        size="lg"
                        className="bg-transparent"
                        onPress={changeStep}
                        disabled={phoneForm.formState.isSubmitting}
                      >
                        <ButtonText>Sign In</ButtonText>
                        {!phoneForm.formState.isSubmitting ? (
                          <ButtonIcon as={Lock} />
                        ) : (
                          <ButtonSpinner />
                        )}
                      </Button>
                    </Gradient>
                  </Form>
                );
              } else {
                return (
                  <Form space="2xl" className="pb-10 pt-20 px-4 w-[100vw]">
                    <Box className="relative ">
                      <HStack space="md" className="px-[10%] ">
                        {["", "", "", "", "", ""].map((item, index) => (
                          <Box
                            key={index}
                            className=" border-2 rounded-lg flex-1 flex items-center justify-center aspect-square border-primary-900 bg-background-100"
                          >
                            <Heading
                              size="sm"
                              className=" leading-none text-black"
                            >
                              {code && code[index] ? code[index] : ""}
                            </Heading>
                          </Box>
                        ))}
                      </HStack>
                      <Box className="absolute top-1/4 w-full ">
                        {/* <Input
                          control={codeForm.control}
                          name="code"
                          keyboardType="number-pad"
                          /> */}
                        <TextInput
                          className=" text-transparent !caret-transparent  cursor-transparent !bg-transparent !border-transparent !outline-none"
                          selectionColor={"transparent"}
                          keyboardType="number-pad"
                          value={code}
                          onChangeText={(text) => {
                            setCode(text);
                          }}
                        />
                      </Box>
                    </Box>
                    <Gradient className="rounded-md mt-10">
                      <Button
                        onPress={confirmCode}
                        size="lg"
                        className="bg-transparent"
                        disabled={pending}
                      >
                        <ButtonText>Confirm Code</ButtonText>
                        {!pending ? (
                          <ButtonIcon as={Check} />
                        ) : (
                          <ButtonSpinner />
                        )}
                      </Button>
                    </Gradient>
                    <Button
                      size="sm"
                      className="bg-transparent"
                      variant="link"
                      onPress={() => {
                        setStep(0);
                      }}
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
