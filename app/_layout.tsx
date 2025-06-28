import AppContextProvider from "@/components/context/AppContextProvider";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import useToast from "@/hooks/useToast";
import { supabase } from "@/supabase";
import { acceptGroupInvite } from "@/supabase/groups";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
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
  const url = Linking.useURL();
  const toast = useToast();

  if (url) {
    const { queryParams } = Linking.parse(url);
    console.log(queryParams);

    if (queryParams && queryParams.phone && queryParams.membership_id) {
      supabase.auth.getUser().then((res) => {
        if (res.data?.user?.phone === queryParams.phone) {
          acceptGroupInvite(
            res.data.user?.id!,
            queryParams.membership_id as string
          ).then((res) => {
            !res.error && toast.show({ message: "Invited group invitation" });
          });
        } else {
          try {
            supabase.auth.signOut();
          } catch (error) {}
          toast.show({
            message: "Account not linked to expected phone number",
            status: "error",
          });
        }
      });
    }
  }

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
