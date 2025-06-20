import { useAppContext } from "@/components/context/AppContextProvider";
import Form from "@/components/Form";
import Gradient from "@/components/Gradient";
import MapAvatar from "@/components/MapAvatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { primaryColors } from "@/constants";
import { addMessageToSOS, createSOS } from "@/supabase/sos";
import { sosT, withoutIdT } from "@/types";
import { getUserLocation } from "@/utils";
import { ChevronUp, Send, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
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
  const [showMessageModal, setShowMessageModal] = useState(false);
  const sosRef = useRef<View>(null);

  const [newSOSId, setNewSOSId] = useState("");
  const avatarRef = useRef<View>(null);
  const {
    userMethods: { user },
  } = useAppContext();

  const [isSafe, setIsSafe] = useState<boolean | undefined | null>(
    user?.is_safe
  );
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
      withTiming(2.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    rippleOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
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
    backgroundColor: primaryColors["--color-primary-500"], // Tailwind primary-400
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
    zIndex: 0,
  }));

  const animatedAvatarPosition = useAnimatedStyle(() => ({
    transform: [{ translateY: avatarTranslation.value }],
  }));

  const avatarPanGesture = Gesture.Pan()
    .onUpdate((e) => {
      avatarTranslation.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.absoluteY < sosBottomPostion.value) {
        const distance = avatarTopPostion.value - sosBottomPostion.value;
        const sosCenter = distance + sosHeight.value / 6;
        avatarTranslation.value = withTiming(-sosCenter, { duration: 2000 });
        runOnJS(setIsSafe)(false);
        runOnJS(sendSOS)();
      } else {
        avatarTranslation.value = withTiming(0, { duration: 2000 });
        runOnJS(setIsSafe)(undefined);
      }
    });

  avatarPanGesture.enabled(isSafe !== false);

  function setBottomPosition(value: number) {
    "worklet";
    if (sosBottomPostion.value) return;
    sosBottomPostion.value = value;
  }

  async function sendSOS() {
    try {
      const location = await getUserLocation();
      console.log(location);

      if (!location) {
        throw new Error("Location required");
      }
      const sos: withoutIdT<sosT> = {
        location: location.coords,
        sent_by: user?.id!,
      };
      const res = await createSOS(sos);
      console.log(res);
      if (res.data && !Array.isArray(res.data)) {
        setNewSOSId(res.data.id!);
      } else {
        throw new Error("id required from newSOS");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View className="flex flex-1 bg-primary-950 px-4">
        <SafeAreaView className="flex-1 justify-between">
          <Center>
            <Box ref={sosRef} className="w-1/2 aspect-square relative">
              <Animated.View style={animatedRippleStyle}></Animated.View>
              <Center className="w-full h-full bg-primary-600 border-4 border-primary-400 rounded-full">
                {isSafe ? (
                  <Heading size="xl" className=" text-typography-300">
                    SOS
                  </Heading>
                ) : (
                  <MapAvatar user={user!} safe={user?.is_safe ?? undefined} />
                )}
              </Center>
            </Box>
          </Center>
          {isSafe === undefined && (
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
            {isSafe === false ? (
              <Heading className=" text-success-600">
                Help is on the way
              </Heading>
            ) : (
              <>
                <GestureDetector gesture={avatarPanGesture}>
                  <Animated.View style={animatedAvatarPosition}>
                    <Box
                      ref={avatarRef}
                      className={`${isSafe === undefined && "animate-pulse"}  `}
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
              setShowMessageModal(false);
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
                    addMessageToSOS({ id: newSOSId, message }).then((res) => {
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
