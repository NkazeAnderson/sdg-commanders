import React from "react";
import { Image } from "./ui/image";

const Logo = () => {
  return (
    <Image
      className="rounded-lg"
      size="md"
      source={require("@/assets/images/logo.png")}
      alt="Logo"
    />
  );
};

export default Logo;
