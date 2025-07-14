import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ArrowUpCircle,
  CircleArrowRight,
  CircleCheck,
  ImageIcon,
  Trash2,
} from "lucide-react-native";

import { useAppContext } from "@/components/context/AppContextProvider";
import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import MapAvatar from "@/components/MapAvatar";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Modal } from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { primaryColors } from "@/constants";
import { uploadBase64ImageToSupabase } from "@/supabase/pictures";
import { addMessageToSOS, createSOS, resolveSOS } from "@/supabase/sos";
import { sosT, withoutIdT } from "@/types";
import { getImageFromGallery, getUserLocation } from "@/utils";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { ChevronUp, Send, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
const SOS = () => {
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.5);
  const avatarTranslation = useSharedValue(0);
  const sosBottomPostion = useSharedValue(0);
  const sosHeight = useSharedValue(0);
  const avatarTopPostion = useSharedValue(0);
  const avatarheight = useSharedValue(0);
  const [message, setMessage] = useState("");
  const [showSendReport, setShowSendReport] = useState(false);
  const sosRef = useRef<View>(null);
  const [sendingSOS, setSendingSOS] = useState(false);
  const [newSOSId, setNewSOSId] = useState("");
  const avatarRef = useRef<View>(null);
  const [reportMessage, setReportMessage] = useState("");
  const [reportImages, setReportImages] = useState<ImagePickerAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    userMethods: { user },
    sosMethods: { sos, activeSos, lastSosResponse, setLastSosResponse },
  } = useAppContext();
  const sosData = activeSos;
  useEffect(() => {
    if (sosRef.current) {
      sosRef.current.measure((x, y, w, h, px, py) => {
        sosHeight.value = h;
        setBottomPosition(py + h);
      });
    }
    if (avatarRef.current) {
      avatarRef.current.measure((x, y, w, h, px, py) => {
        avatarheight.value = h;
        avatarTopPostion.value = py;
      });
    }
  }, []);
  useEffect(() => {
    rippleScale.value = withRepeat(
      withTiming(2.5, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false
    );
    rippleOpacity.value = withRepeat(
      withTiming(0, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false
    );
  }, []);
  const animatedRippleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    backgroundColor: user?.is_safe
      ? primaryColors["--color-primary-500"]
      : "red",
    // Tailwind primary-400
    opacity: rippleOpacity.value,
    transform: [
      {
        scale: rippleScale.value,
      },
    ],
    zIndex: 0,
  }));
  const animatedAvatarPosition = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: avatarTranslation.value,
      },
    ],
  }));
  const avatarPanGesture = Gesture.Pan()
    .onUpdate((e) => {
      avatarTranslation.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.absoluteY < sosBottomPostion.value) {
        runOnJS(sendSOS)();
      } else {
        avatarTranslation.value = withTiming(0, {
          duration: 2000,
          easing: Easing.bounce,
        });
      }
    });

  avatarPanGesture.enabled(user?.is_safe ?? true);
  function setBottomPosition(value: number) {
    "worklet";

    if (sosBottomPostion.value) return;
    sosBottomPostion.value = value;
  }
  async function sendSOS() {
    setSendingSOS(true);
    try {
      const location = await getUserLocation();
      if (!location) {
        throw new Error("Location required");
      }
      const sos: withoutIdT<sosT> = {
        location: location.coords,
        sent_by: user?.id!,
      };
      const res = await createSOS(sos);
      if (res.data && !Array.isArray(res.data)) {
        runOnJS(setNewSOSId)(res.data.id!);
      } else {
        throw new Error("id required from newSOS");
      }
    } catch (error) {
      console.log(error);
    }
    setSendingSOS(false);
  }
  async function addImages() {
    const image = await getImageFromGallery();
    image && setReportImages((prev) => [image, ...prev]);
  }

  function removeImages(image: ImagePickerAsset) {
    setReportImages((prev) => prev.filter((item) => item.uri !== image.uri));
  }

  async function sendReport() {
    setSubmitting(true);

    const imagesUrl: string[] = [];
    for (let image of reportImages) {
      const url = await uploadBase64ImageToSupabase(image);
      console.log(url);

      imagesUrl.push(url);
    }

    if (!lastSosResponse) {
      setSubmitting(false);
      throw new Error("lastSOSResponse Required");
    }
    const res = await resolveSOS({
      ...lastSosResponse,
      description: reportMessage,
      images: imagesUrl,
    });
    setSubmitting(false);
    if (!res.some((item) => item.error)) {
      setReportMessage("");
      setReportImages([]);
      setLastSosResponse(undefined);
      setShowSendReport(false);
    } else {
      console.log(res);
    }
  }

  if (user?.is_agent) {
    if (!sosData) {
      return (
        <View className="flex flex-1  bg-primary-950 px-4">
          <Center className="flex-1 items-center justify-center gap-5">
            {/* <Box className=" w-10 aspect-square rounded-full flex justify-center items-center">

          </Box> */}
            <Icon className=" text-success-500 w-10 h-10" as={CircleCheck} />
            <Text>No Active SOS mission</Text>
          </Center>
        </View>
      );
    }
    return (
      <View className="flex flex-1  bg-primary-950 px-4">
        <SafeAreaView className="flex-1 gap-4">
          <Heading size="xl" className=" text-primary-200 text-center py-4">
            Current SOS Mission
          </Heading>
          <ScrollView className=" gap-4">
            <Center>
              <Avatar size={"2xl"}>
                <AvatarFallbackText>{sosData.sent_by.name}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: sosData.sent_by.profile_picture ?? "",
                  }}
                />
              </Avatar>
              <Heading className=" capitalize my-2 text-typography-0">
                {sosData.sent_by.name}
              </Heading>
            </Center>
            {Boolean(sosData.message) && (
              <Box>
                <Heading className=" text-primary-50">Message</Heading>
                <Text className=" text-typography-0">{sosData.message}</Text>
              </Box>
            )}

            {!showSendReport ? (
              <HStack className="py-4 " space="lg">
                <Button
                  className=" flex-1"
                  onPress={() => {
                    router.push("/tabs");
                  }}
                >
                  <ButtonText>Go</ButtonText>
                  <ButtonIcon as={CircleArrowRight} />
                </Button>
                <Button
                  action="positive"
                  onPress={() => {
                    setShowSendReport(true);
                  }}
                >
                  <ButtonText>Mark as resolved</ButtonText>
                  <ButtonIcon as={CircleCheck} />
                </Button>
              </HStack>
            ) : (
              <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
                <Center>
                  <Button
                    action="negative"
                    onPress={() => {
                      setShowSendReport(false);
                    }}
                    className=" aspect-square rounded-full"
                  >
                    <ButtonIcon as={X} />
                  </Button>
                </Center>
                <Heading className=" text-primary-50 my-2">Report</Heading>
                <Form space="lg">
                  <Textarea>
                    <TextareaInput
                      value={reportMessage}
                      onChangeText={(text) => {
                        setReportMessage(text);
                      }}
                      placeholder="Report message"
                    />
                  </Textarea>

                  {reportImages.map((item, index) => (
                    <Box className="w-full relative aspect-square" key={index}>
                      <Image
                        className="w-full h-full border  rounded-xl"
                        source={{ uri: item.uri }}
                        alt="incident images"
                      />
                      <Button
                        action="negative"
                        className=" absolute bottom-4 right-4"
                        onPress={() => {
                          removeImages(item);
                        }}
                      >
                        <ButtonIcon as={Trash2} />
                      </Button>
                    </Box>
                  ))}

                  <Box className="pr-[30%]">
                    <Button variant="outline" onPress={addImages}>
                      <ButtonText>Add Image</ButtonText>
                      <ButtonIcon as={ImageIcon} />
                    </Button>
                  </Box>

                  <Box className=" my-4">
                    <Button onPress={sendReport}>
                      <ButtonText>Upload Report</ButtonText>
                      {submitting ? (
                        <ButtonSpinner />
                      ) : (
                        <ButtonIcon as={ArrowUpCircle} />
                      )}
                    </Button>
                  </Box>
                </Form>
              </Animated.View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
  return (
    <>
      <View className="flex flex-1 bg-primary-950 px-4">
        <SafeAreaView className="flex-1 justify-between">
          <Center>
            <Box ref={sosRef} className="w-1/2 aspect-square relative">
              <Animated.View style={animatedRippleStyle}></Animated.View>
              <Center
                className={`w-full h-full ${
                  user?.is_safe
                    ? "bg-primary-600 border-primary-400"
                    : "bg-error-200 border-error-50"
                }  border-4  rounded-full`}
              >
                {user?.is_safe ? (
                  <Heading size="xl" className=" text-typography-300">
                    {sendingSOS ? "Sending" : "SOS"}
                  </Heading>
                ) : (
                  <MapAvatar user={user!} safe={user?.is_safe ?? undefined} />
                )}
              </Center>
            </Box>
          </Center>
          {user?.is_safe && (
            <Center>
              <Animated.View className={" animate-bounce"}>
                <Icon
                  className="text-typography-400 w-10 h-10"
                  as={ChevronUp}
                />
                <Icon
                  className="text-typography-400 w-10 h-10"
                  as={ChevronUp}
                />
                <Icon
                  className="text-typography-400 w-10 h-10"
                  as={ChevronUp}
                />
              </Animated.View>
            </Center>
          )}
          <Center className="pb-20 gap-2">
            {user?.is_safe === false ? (
              <Heading className=" text-success-600">
                Help is on the way
              </Heading>
            ) : (
              <>
                <GestureDetector gesture={avatarPanGesture}>
                  <Animated.View style={animatedAvatarPosition}>
                    <Box
                      ref={avatarRef}
                      className={`${
                        user?.is_safe !== true && "animate-pulse"
                      }  `}
                    >
                      <MapAvatar
                        user={user!}
                        safe={user?.is_safe ?? undefined}
                      />
                    </Box>
                  </Animated.View>
                </GestureDetector>
                <Heading className=" text-typography-100">
                  Slide into SOS mode
                </Heading>
              </>
            )}
          </Center>
        </SafeAreaView>
      </View>
      <Modal isOpen={newSOSId ? true : false}>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
          className="flex-1 bg-primary-600/90 w-full justify-center items-center relative"
        >
          <Button
            className=" absolute top-16 right-10 aspect-square rounded-full bg-primary-700"
            variant="outline"
            action="secondary"
            onPress={() => {
              Keyboard.dismiss();
              setNewSOSId("");
            }}
          >
            <ButtonIcon className="text-white" as={X} />
          </Button>
          <Form className="w-3/4">
            <Textarea className=" bg-primary-950 rounded-lg border-primary-500 ">
              <TextareaInput
                placeholder="Add Message to SOS notification"
                className="!text-typography-100 "
                onChangeText={(text) => {
                  setMessage(text);
                }}
              />
            </Textarea>

            <Gradient>
              <Button
                className="bg-transparent"
                onPress={() => {
                  if (newSOSId && message) {
                    addMessageToSOS({
                      id: newSOSId,
                      message,
                    }).then((res) => {
                      setNewSOSId("");
                      setMessage("");
                    });
                  }
                }}
              >
                <ButtonText>Send Message</ButtonText>
                <ButtonIcon as={Send} />
              </Button>
            </Gradient>
          </Form>
        </Pressable>
      </Modal>
    </>
  );
};
export default SOS;
