import useToast from "@/hooks/useToast";
import { supabase } from "@/supabase";
import {
  createGroupMember,
  groupMembersJoinedSchemaT,
} from "@/supabase/groups";
import { hookFormErrorHandler } from "@/utils";
import { groupMembersSchema, usersSchema } from "@/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
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
  .merge(usersSchema.pick({ phone: true }));

const GroupMembersList = ({
  members,
  manage,
}: {
  members: groupMembersJoinedSchemaT[];
  manage?: boolean;
}) => {
  const [addNewMember, setAddNewMember] = useState(false);
  const group = members[0]?.group_id;
  const {
    userMethods: { user },
    subscriptions,
  } = useAppContext();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      group_id: group.id,
    },
  });

  const subscription = subscriptions.find(
    (item) => item.id === group?.subcription
  );

  function toggleAddMember() {
    setAddNewMember((prev) => !prev);
  }

  const toast = useToast();

  async function submit(data: z.infer<typeof schema>) {
    const res = await createGroupMember(data);
    if (!res.error) {
      const smsRes = await supabase.functions.invoke("sendsms", {
        body: {
          phone: String(data.phone),
          message: `You have been invited to join a family on SGK Commanders. Click the link below to accept the invitation: https://sgkcommanders.com`,
        },
      });
      !smsRes.error && toast.show({ message: "Invitation sent" });
      toggleAddMember();
    } else {
      toast.show({ message: "Invitation not sent", status: "error" });
    }
  }
  return (
    <VStack space="xs" className=" border-y border-primary-100/20 py-4">
      <Center className=" flex-row">
        <Heading className="text-center text-primary-100 capitalize ">
          {group.name} -{" "}
        </Heading>

        <Text className="text-center text-typography-50 italic">
          {!subscription ? "No subscription" : subscription.name}
        </Text>
      </Center>
      {!subscription ? (
        <Box className=" gap-4 py-4">
          <Animated.View entering={SlideInRight.springify()}>
            <HStack className=" justify-end">
              <Button
                action="positive"
                className="rounded-l-3xl "
                onPress={() => {
                  router.push({
                    pathname: "/stacks/subscriptions",
                    params: { groupId: group.id },
                  });
                }}
              >
                <ButtonText>Pay Subscription Now </ButtonText>
              </Button>
            </HStack>
          </Animated.View>
        </Box>
      ) : (
        manage &&
        user?.id === group.admin_id && (
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
                    errors={errors}
                  />
                  <Input
                    control={control}
                    name="role"
                    label="Role"
                    placeholder="Son"
                    helperText="Example: Son"
                    labelClassName="text-typography-0"
                    errors={errors}
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
        )
      )}
      {members.map((member) => (
        <MemberCard
          key={member.id}
          user={member.member_id}
          role={member.role}
          manage={manage}
        />
      ))}

      {subscription &&
        members.length === subscription.maximumSubAccounts - 1 && (
          <Box className=" gap-4 py-4">
            <Animated.View entering={SlideInRight.springify()}>
              <HStack className=" justify-end">
                <Button
                  action="positive"
                  className="rounded-l-3xl "
                  onPress={() => {
                    router.push({
                      pathname: "/stacks/subscriptions",
                      params: { groupId: group.id },
                    });
                  }}
                >
                  <ButtonText>Upgrade Plan Now</ButtonText>
                </Button>
              </HStack>
            </Animated.View>
          </Box>
        )}
    </VStack>
  );
};

export default GroupMembersList;
