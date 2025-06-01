import { defaultGradient } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";
import { Box } from "./ui/box";

const Gradient = ({
  children,
  colors = defaultGradient,
  className,
  start = { x: 0, y: 0.5 },
  ...rest
}: PropsWithChildren &
  Partial<React.ComponentProps<typeof LinearGradient>>) => {
  return (
    <Box className={`overflow-hidden ${className}`}>
      <LinearGradient colors={colors} start={start} {...rest}>
        {children}
      </LinearGradient>
    </Box>
  );
};

export default Gradient;
