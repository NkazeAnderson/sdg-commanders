import { useAppContext } from "@/components/context/AppContextProvider";
import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import useToast from "@/hooks/useToast";
import { uploadBase64ImageToSupabase } from "@/supabase/pictures";
import { updateUser } from "@/supabase/users";
import { userT } from "@/types";
import {
  getImageFromGallery,
  hookFormErrorHandler,
  unknownErrorHandler,
} from "@/utils";
import { usersSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { ArrowRight, Camera, CircleUserRound } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const EditProfile = () => {
  const [profilePictureAsset, setProfilePictureAsset] =
    useState<ImagePickerAsset>();
  const {
    userMethods: { user, setUser },
  } = useAppContext();
  const toast = useToast();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(usersSchema),
    defaultValues: user ?? {},
  });

  async function submit(data: userT) {
    try {
      Object.keys(data).forEach((item) => {
        //@ts-ignore
        if (!data[item]) {
          //@ts-ignore
          delete data[item];
        }
      });
      if (profilePictureAsset) {
        const url = await uploadBase64ImageToSupabase(profilePictureAsset);
        data.profile_picture = url;
      }
      const res = await updateUser(data);
      setUser({ ...user, ...data });
      toast.show({ message: "Successfully updated your profile" });
      if (res.error) {
        throw new Error(res.error.message);
      }
      router.back();
      return res;
    } catch (error) {
      toast.show({ message: "Sorry, We could not update profile now!" });
      unknownErrorHandler(error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="px-4 flex-1 bg-primary-900"
    >
      <SafeAreaView className="flex-1">
        <Center>
          <Center className="w-36 aspect-square rounded-full bg-primary-200 relative">
            {profilePictureAsset || user?.profile_picture ? (
              <Avatar size="2xl">
                <AvatarImage
                  source={{
                    uri: profilePictureAsset
                      ? profilePictureAsset.uri
                      : user?.profile_picture ?? "",
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
              className="aspect-square rounded-full absolute bottom-4 -right-0"
              onPress={async () => {
                const res = await getImageFromGallery();
                if (res) {
                  setProfilePictureAsset(res);
                }
              }}
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
              errors={errors}
            />
            <Input
              control={control}
              name="email"
              label="Email"
              placeholder="Your email"
              labelClassName="text-typography-100"
              errors={errors}
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
              errors={errors}
              keyboardType="number-pad"
            />
            <Input
              control={control}
              name="home_address"
              label="Home Address"
              placeholder="Your address"
              labelClassName="text-typography-100"
              errors={errors}
            />
          </Form>

          <VStack space="md" className="py-10 justify-end">
            <Gradient className="rounded-md">
              <Button
                size="lg"
                className="bg-transparent"
                onPress={handleSubmit(submit, hookFormErrorHandler)}
                disabled={isSubmitting}
              >
                <ButtonText>Submit</ButtonText>
                {isSubmitting ? (
                  <ButtonSpinner />
                ) : (
                  <ButtonIcon as={ArrowRight} />
                )}
              </Button>
            </Gradient>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default EditProfile;
