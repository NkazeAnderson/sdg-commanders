import { useAppContext } from "@/components/context/AppContextProvider";
import Form from "@/components/Form";
import GroupMembersList from "@/components/GroupMembersList";
import Input from "@/components/Input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import useToast from "@/hooks/useToast";
import { createGroup } from "@/supabase/groups";
import { groupT, withoutIdT } from "@/types";
import { hookFormErrorHandler } from "@/utils";
import { groupsSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { ArrowRight, X } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

const Members = () => {
  const [createFamily, setCreateFamily] = useState(false);

  const [addNewMember, setAddNewMember] = useState(false);
  const { control } = useForm();
  function toggleAddMember() {
    setAddNewMember((prev) => !prev);
  }
  function toggleCreateFamily() {
    setCreateFamily((prev) => !prev);
  }
  const {
    userMethods: { myGroups, user },
  } = useAppContext();
  const toast = useToast();
  const createFamilyForm = useForm({
    resolver: zodResolver(groupsSchema.omit({ id: true })),
    defaultValues: {
      admin_id: user?.id,
    },
  });

  async function sumbitCreateFamily(data: withoutIdT<groupT>) {
    if (!user) {
      throw new Error("User is required");
    }
    Keyboard.isVisible() && Keyboard.dismiss();
    const res = await createGroup(data);
    if (!res.error) {
      toast.show({ message: "Family successly created" });
    } else {
      toast.show({ message: res.error.message, status: "error" });
    }
    toggleCreateFamily();
  }

  const groupsKeys = !myGroups ? [] : Object.keys(myGroups);

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
        className="flex-1"
      >
        <View className=" flex-1 bg-primary-900 p-4">
          {Boolean(groupsKeys.length) && myGroups && (
            <ScrollView>
              {groupsKeys.map((item) => {
                const members = myGroups[item];
                return <GroupMembersList key={item} members={members} manage />;
              })}
            </ScrollView>
          )}
          {!Boolean(groupsKeys.length) && (
            <Center className=" flex-1 gap-4 p">
              {createFamily ? (
                <Animated.View entering={SlideInDown} className={"w-full"}>
                  <Center>
                    <Button
                      onPress={toggleCreateFamily}
                      action="negative"
                      className=" rounded-full aspect-square"
                    >
                      <ButtonIcon as={X} />
                    </Button>
                  </Center>
                  <Form>
                    <Heading className=" text-center text-typography-100">
                      Create a family
                    </Heading>
                    <Input
                      label="Family name"
                      control={createFamilyForm.control}
                      name="name"
                      labelClassName="text-typography-50"
                      returnKeyLabel="Add"
                      returnKeyType="send"
                    />
                    <Button
                      disabled={createFamilyForm.formState.isSubmitting}
                      onPress={createFamilyForm.handleSubmit(
                        sumbitCreateFamily,
                        hookFormErrorHandler
                      )}
                    >
                      <ButtonText>Submit</ButtonText>
                      {!createFamilyForm.formState.isSubmitting ? (
                        <ButtonIcon as={ArrowRight} />
                      ) : (
                        <ButtonSpinner />
                      )}
                    </Button>
                  </Form>
                </Animated.View>
              ) : (
                <>
                  <Text>You are not a member of a family or organisation</Text>
                  <Button onPress={toggleCreateFamily}>
                    <ButtonText>Create a family</ButtonText>
                  </Button>
                </>
              )}
            </Center>
          )}
        </View>
      </KeyboardAvoidingView>
      <Stack.Screen options={{ title: "Groups & Families" }} />
    </>
  );
};

export default Members;
