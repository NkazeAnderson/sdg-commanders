import { Button, ButtonIcon } from "@/components/ui/button";
import { primaryColors } from "@/constants";
import { Link, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColors["--color-primary-900"],
        },
        headerTitleStyle: {
          color: primaryColors["--color-primary-0"],
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <Link asChild href={".."}>
            <Button className=" pr-4" variant="link">
              <ButtonIcon as={ChevronLeft} />
            </Button>
          </Link>
        ),
      }}
    />
  );
};

export default _layout;
