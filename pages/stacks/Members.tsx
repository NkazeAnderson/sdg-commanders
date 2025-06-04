import Form from "@/components/Form";
import Input from "@/components/Input";
import MemberCard from "@/components/MemberCard";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Plus, PlusCircle, X } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

const Members = () => {
  const [addNewMember, setAddNewMember] = useState(false);
  const { control } = useForm();
  function toggleAddMember() {
    setAddNewMember((prev) => !prev);
  }
  return (
    <View className=" flex-1 bg-primary-900">
      <ScrollView className=" ">
        <VStack space="xs">
          <HStack
            className={`${
              addNewMember ? " justify-center" : " justify-end"
            } py-2 `}
          >
            {!addNewMember ? (
              <Button onPress={toggleAddMember} className=" rounded-l-full">
                <ButtonIcon as={Plus} />
                <ButtonText>Add Member</ButtonText>
              </Button>
            ) : (
              <Button
                onPress={toggleAddMember}
                action="negative"
                className=" rounded-full aspect-square"
              >
                <ButtonIcon as={X} />
              </Button>
            )}
          </HStack>
          {addNewMember && (
            <Animated.View entering={SlideInRight.mass(100)}>
              <Form className="pb-6 px-4">
                <Input
                  control={control}
                  name="phone"
                  label="Phone"
                  placeholder="phone"
                  labelClassName="text-typography-0"
                />
                <Input
                  control={control}
                  name="role"
                  label="Role"
                  placeholder="Son"
                  helperText="Example: Son"
                  labelClassName="text-typography-0"
                />
                <Box className="">
                  <Button>
                    <ButtonText>Submit</ButtonText>
                    <ButtonIcon as={PlusCircle} />
                  </Button>
                </Box>
              </Form>
            </Animated.View>
          )}
          <MemberCard role="Son" manage />
          <MemberCard role="Daughter" manage />
          <MemberCard role="Wife" manage />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default Members;
