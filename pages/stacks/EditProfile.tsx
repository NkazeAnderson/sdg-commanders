import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ArrowRight, Camera, CircleUserRound } from "lucide-react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const EditProfile = () => {
  const { control } = useForm();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="px-4 flex-1 bg-primary-900"
    >
      <SafeAreaView className="flex-1">
        <Center>
          <Center className="w-36 aspect-square rounded-full bg-primary-200 relative">
            <Icon className="w-20 h-20 text-primary-600" as={CircleUserRound} />
            <Button
              action={"primary"}
              variant={"solid"}
              size={"md"}
              className="aspect-square rounded-full absolute bottom-4 -right-0"
            >
              <ButtonIcon as={Camera} />
            </Button>
          </Center>
        </Center>

        <ScrollView showsVerticalScrollIndicator={false}>
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
              disabled
            />
            <Input
              control={control}
              name="emergency_phone"
              label="Emergency Phone"
              placeholder="Optional phone incase of emergency"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="address"
              label="Home Address"
              placeholder="Your address"
              labelClassName="text-typography-100"
            />
            <Input
              control={control}
              name="family"
              label="Family"
              placeholder="Family Name"
              labelClassName="text-typography-100"
            />
          </Form>

          <VStack space="md" className="py-10 justify-end">
            <Gradient className="rounded-md">
              <Button size="lg" className="bg-transparent">
                <ButtonText>Submit</ButtonText>
                <ButtonIcon as={ArrowRight} />
              </Button>
            </Gradient>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default EditProfile;
