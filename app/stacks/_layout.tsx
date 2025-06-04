import { primaryColors } from "@/constants";
import { Stack } from "expo-router";
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
      }}
    />
  );
};

export default _layout;
