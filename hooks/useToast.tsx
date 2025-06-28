import {
  Toast as GlueToast,
  ToastDescription,
  ToastTitle,
  useToast as glueUseToast,
} from "@/components/ui/toast";
import React from "react";

export default function useToast() {
  const toast = glueUseToast();

  const show = ({
    message,
    status = "success",
  }: {
    message: string;
    status?: "error" | "warning" | "success" | "info" | "muted";
  }) => {
    toast.show({
      placement: "top",
      duration: 3000,
      render: () => {
        return (
          <GlueToast action={status} variant="solid">
            <ToastTitle className=" capitalize">{status}</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </GlueToast>
        );
      },
    });
  };
  return {
    show,
  };
}
