import { useAppContext } from "@/components/context/AppContextProvider";
import Gradient from "@/components/Gradient";
import Input from "@/components/Input";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/supabase";
import { groupT, paymentT } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Href, router, useLocalSearchParams } from "expo-router";
import { CreditCard, Phone } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const Subscriptions = () => {
  const { groupId, userId } = useLocalSearchParams<{
    groupId?: string;
    userId?: string;
  }>();
  const [showDrawer, setShowDrawer] = useState(false);
  const [payWith, setPaywith] = useState<"phone" | "card">("phone");

  const {
    userMethods: { user, myGroups },
    subscriptions,
  } = useAppContext();
  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Omit<paymentT, "id" | "by" | "date" | "status" | "amount">>({
    defaultValues: { group: groupId, months: 1 },
  });

  const groupKeys = Object.keys(myGroups);

  const adminGroups = groupKeys
    .map((item) => myGroups[item][0].group_id)
    .filter(
      (item) =>
        user?.id === item.admin_id &&
        item.subcription &&
        item.subcriptionExpiration
    );
  const submitting = useRef(false);

  async function submit(data: any) {
    const res = await supabase.functions.invoke("tara-payments", {
      body: data,
    });
    if (res.data) {
      const data: {
        status: "success";
        message: string;
        whatsappLink: Href;
        telegramLink: Href;
        dikaloLink: Href;
        smsLink: string;
      } = res.data;

      if (payWith === "card") {
        router.navigate(data.dikaloLink);
      }
    }
    if (res.error instanceof FunctionsHttpError) {
      console.log(res.error.message, res.error.context);
    }
    setShowDrawer(false);
  }

  return (
    <>
      <ScrollView className=" flex-1 bg-primary-950 p-4 gap-4">
        {groupId || userId ? (
          subscriptions
            .filter((item) =>
              groupId ? item.for === "groups" : item.for === "individuals"
            )
            .map((item) => (
              <Box
                key={item.id}
                className=" relative bg-primary-200  rounded-lg p-2 my-4"
              >
                <Gradient
                  className="overflow-hidden rounded-full "
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0.4, y: 0 }}
                >
                  <VStack space="xl" className=" items-center relative p-6">
                    <Image
                      className=" w-10 h-10"
                      source={
                        item.for === "groups"
                          ? require("@/assets/images/family.png")
                          : require("@/assets/images/person.png")
                      }
                      alt="icon"
                    />
                    <Heading className="text-primary-50 capitalize" size="2xl">
                      {item.name}
                    </Heading>
                    <HStack space="sm" className=" items-end">
                      <Heading className=" text-primary-500" size="lg">
                        {item.price}
                      </Heading>
                      <Text className=" text-typography-50">/month</Text>
                    </HStack>
                    <HStack space="md" className=" items-center">
                      <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
                      <Text className=" text-typography-50">
                        1 Principal account
                      </Text>
                    </HStack>
                    {item.maximumSubAccounts > 0 && (
                      <HStack space="md" className=" items-center">
                        <Box className="w-1 aspect-square bg-primary-500 rounded-full "></Box>
                        <Text className=" text-typography-50">
                          {item.maximumSubAccounts} Sub accounts
                        </Text>
                      </HStack>
                    )}
                    <Button
                      onPress={() => {
                        setShowDrawer(true);
                        setValue("subscription", item.id!);
                      }}
                    >
                      <ButtonText>Select</ButtonText>
                    </Button>
                  </VStack>
                </Gradient>
              </Box>
            ))
        ) : (
          <>
            {!adminGroups.length ? (
              <>
                <Box className=" gap-4 pt-4 pb-10">
                  <Heading className=" text-primary-200">
                    Personal Account subscription
                  </Heading>
                  <SimpleSubscriptionListCard item={user!} />
                  <Text className=" text-secondary-500" italic size="sm">
                    Your personal account subscription is only used if all your
                    group subscriptions are expired or you are not part of a
                    group.
                  </Text>
                </Box>
                <Divider className="bg-primary-400" />
                <Center className="px-4 py-10 gap-4">
                  <Heading className="text-primary-50">
                    You don't own a family
                  </Heading>
                  <Text className=" text-center text-typography-100">
                    Create a family to have users you can manage and ensure
                    their safety
                  </Text>
                  <Button
                    onPress={() => {
                      router.push("/stacks/members");
                    }}
                  >
                    <ButtonText>Create a family</ButtonText>
                  </Button>
                </Center>
              </>
            ) : (
              adminGroups.map((item) => {
                return <SimpleSubscriptionListCard item={item} key={item.id} />;
              })
            )}
          </>
        )}
      </ScrollView>
      <Drawer
        isOpen={showDrawer && !submitting.current}
        onClose={() => {
          setShowDrawer(false);
        }}
        size="sm"
        anchor="top"
      >
        <DrawerBackdrop />
        <DrawerContent className="rounded-b-3xl bg-primary-900 h-[60vh]">
          <DrawerHeader className="py-10">
            <Heading size="xl" className="text-primary-500">
              Enter payment details
            </Heading>
            <Button
              action="negative"
              onPress={() => {
                setShowDrawer(false);
              }}
              className="self-end"
            >
              <ButtonText>Close</ButtonText>
            </Button>
          </DrawerHeader>

          <DrawerBody className=" gap-2 ">
            <Box className=" gap-4">
              <Input
                control={control}
                name="months"
                keyboardType="number-pad"
                label="Months"
                labelClassName="text-typography-50"
              />
              <Box>
                <Text className="text-typography-50">Pay with</Text>
                <HStack space="xl">
                  <Button
                    variant={payWith !== "phone" ? "outline" : "solid"}
                    onPress={() => {
                      setPaywith("phone");
                    }}
                    className="flex-1"
                    isDisabled={isSubmitting}
                  >
                    <ButtonIcon as={Phone} />
                    <ButtonText>MoMo</ButtonText>
                  </Button>
                  <Button
                    variant={payWith !== "card" ? "outline" : "solid"}
                    onPress={() => {
                      setValue("phone", undefined);
                      setPaywith("card");
                    }}
                    className="flex-1"
                    isDisabled={isSubmitting}
                  >
                    <ButtonIcon as={CreditCard} />
                    <ButtonText>Card</ButtonText>
                  </Button>
                </HStack>
              </Box>
              {payWith === "phone" && (
                <Input
                  control={control}
                  name="phone"
                  keyboardType="number-pad"
                  label="Phone"
                  labelClassName="text-typography-50"
                />
              )}
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={handleSubmit(submit)}
              className="self-end"
              isDisabled={isSubmitting}
            >
              <ButtonText>Pay Now!</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function SimpleSubscriptionListCard({
  item,
}: {
  item: Pick<groupT, "id" | "name" | "subcriptionExpiration" | "subcription">;
}) {
  const { subscriptions } = useAppContext();
  const subscription = subscriptions.find((sub) => sub.id === item.subcription);
  const expired = new Date(item.subcriptionExpiration!) < new Date();
  return (
    <HStack
      className=" border border-primary-200 rounded-2xl p-2 items-end "
      space="md"
    >
      <Box className=" flex-1 gap-2">
        <Heading size="sm" className=" text-primary-50 capitalize">
          {item.name}
        </Heading>
        <Heading size="2xl" className=" text-primary-500">
          {subscription?.name}
        </Heading>
        <HStack className=" items-center">
          {expired ? (
            <>
              <Text className="text-typography-50">Expired on: </Text>
              <Text size="lg" className="text-error-500">
                {new Date(item.subcriptionExpiration!).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <>
              <Text size="lg" className="text-typography-50">
                Expires on:{" "}
              </Text>
              <Text className="text-success-500">
                {new Date(item.subcriptionExpiration!).toLocaleDateString()}
              </Text>
            </>
          )}
        </HStack>
      </Box>
      <Box className=" gap-2">
        {expired ? (
          <>
            <Text className=" text-error-500 text-end" bold>
              Expired
            </Text>
            <Button
              onPress={() => {
                subscription?.for === "individuals"
                  ? router.setParams({ userId: item.id })
                  : router.setParams({ groupId: item.id });
              }}
            >
              <ButtonText>Pay</ButtonText>
            </Button>
          </>
        ) : (
          <Text className=" text-success-500" bold>
            Active
          </Text>
        )}
      </Box>
    </HStack>
  );
}

export default Subscriptions;
