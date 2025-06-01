import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <GestureHandlerRootView>
        <GluestackUIProvider mode="light">
          <View className="flex-1 bg-gray-600">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
        </GluestackUIProvider>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </>
  );
}
