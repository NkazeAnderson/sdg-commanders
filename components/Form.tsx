import React, { FC, PropsWithChildren } from "react";
import { VStack } from "./ui/vstack";

const Form: FC<
  PropsWithChildren & {
    space?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    className?: string;
  }
> = (props) => {
  return (
    <VStack space={props.space ?? "md"} className={props.className}>
      {props.children}
    </VStack>
  );
};

export default Form;
