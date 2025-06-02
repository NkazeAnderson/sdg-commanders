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
import { ChevronUp, Send, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
  const [message, setMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSafe, setIsSafe] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    isSafe === false && setShowMessageModal(true);
  }, [isSafe]);

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
      console.log(
        "ended",
        e.absoluteY,
        sosBottomPostion.value,
        e.absoluteY < sosBottomPostion.value
      );

      if (e.absoluteY < sosBottomPostion.value) {
        console.log("not safe");
        runOnJS(setIsSafe)(false);
      } else {
        runOnJS(setIsSafe)(undefined);
      }
    });
  return (
    <>
      <View className="flex flex-1 bg-primary-950 px-4">
        <SafeAreaView className="flex-1 justify-between">
          <Center>
            <Box
              className="w-1/2 aspect-square relative"
              onLayout={(e) => {
                const layout = e.nativeEvent.layout;
                sosBottomPostion.value = layout.y + layout.height;
              }}
            >
              <Animated.View style={animatedRippleStyle}></Animated.View>
              <Center className="w-full h-full bg-primary-600 border-4 border-primary-400 rounded-full">
                <Heading size="xl" className=" text-typography-300">
                  SOS
                </Heading>
              </Center>
            </Box>
          </Center>

          <Center>
            <Animated.View>
              <Icon className="text-typography-400 w-10 h-10" as={ChevronUp} />
              <Icon className="text-typography-400 w-10 h-10" as={ChevronUp} />
              <Icon className="text-typography-400 w-10 h-10" as={ChevronUp} />
            </Animated.View>
          </Center>
          <Center className="pb-20 gap-2">
            <GestureDetector gesture={avatarPanGesture}>
              <Animated.View style={animatedAvatarPosition}>
                <Box className={`${isSafe === undefined && "animate-pulse"}  `}>
                  <MapAvatar
                    user={{
                      name: "Wale",
                      id: "7776777",
                      profilePic:
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                    }}
                    safe={isSafe}
                  />
                </Box>
              </Animated.View>
            </GestureDetector>
            <Heading className=" text-typography-100">
              Slide into SOS mode
            </Heading>
          </Center>
        </SafeAreaView>
      </View>
      <Modal isOpen={showMessageModal}>
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
              <Button className="bg-transparent">
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
