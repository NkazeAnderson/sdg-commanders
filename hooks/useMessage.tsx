import { messageT } from "@/types";
import { useState } from "react";

const useMessage = () => {
  const [messages, setMessages] = useState<messageT[]>([]);
  return { messages, setMessages };
};

export default useMessage;
