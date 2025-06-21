import AppContextProvider from "@/components/context/AppContextProvider";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // loaded && router.push("/tabs/sos");
  }, [loaded]);

  if (!loaded) {
    console.log("Not loaded in " + Platform.OS);

    return null;
  }
  console.log("Loaded in " + Platform.OS);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, display: "flex" }}>
        <GluestackUIProvider mode="light">
          <View className="flex-1 bg-gray-600">
            <AppContextProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </AppContextProvider>
          </View>
        </GluestackUIProvider>
      </GestureHandlerRootView>
      <StatusBar style="light" />
    </>
  );
}
