import {
  createGroupMember,
  groupMembersJoinedSchemaT,
} from "@/supabase/groups";
import { hookFormErrorHandler } from "@/utils";
import { groupMembersSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, X } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Animated, { SlideInRight } from "react-native-reanimated";
import { z } from "zod";
import { useAppContext } from "./context/AppContextProvider";
import Form from "./Form";
import Input from "./Input";
import MemberCard from "./MemberCard";
import { Box } from "./ui/box";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "./ui/button";
import { Center } from "./ui/center";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

const schema = groupMembersSchema
  .omit({ id: true })
  .extend({ phone: z.number() });

const GroupMembersList = ({
  members,
  manage,
}: {
  members: groupMembersJoinedSchemaT[];
  manage?: boolean;
}) => {
  const [addNewMember, setAddNewMember] = useState(false);
  const group = members[0].group_id;
  const {
    userMethods: { user },
  } = useAppContext();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      group_id: group.id,
    },
  });
  function toggleAddMember() {
    setAddNewMember((prev) => !prev);
  }
  async function submit(data: z.infer<typeof schema>) {
    const res = await createGroupMember(data);
    console.log(res);
  }
  return (
    <VStack space="xs">
      <Center className=" flex-row">
        <Heading className="text-center text-primary-100 capitalize ">
          {group.name} -{" "}
        </Heading>

        <Text className="text-center text-typography-50 italic">
          {group.is_organisation ? "Organisation" : "Family"}
        </Text>
      </Center>
      {manage && (
        <>
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
                  keyboardType="number-pad"
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
                  <Button
                    onPress={handleSubmit(submit, hookFormErrorHandler)}
                    disabled={isSubmitting}
                  >
                    <ButtonText>Submit</ButtonText>
                    {!isSubmitting ? (
                      <ButtonIcon as={PlusCircle} />
                    ) : (
                      <ButtonSpinner />
                    )}
                  </Button>
                </Box>
              </Form>
            </Animated.View>
          )}
        </>
      )}
      {members.map((member) => (
        <MemberCard
          key={member.id}
          user={member.member_id}
          role={member.role}
          manage={manage}
        />
      ))}
    </VStack>
  );
};

export default GroupMembersList;
