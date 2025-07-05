import { joinedSOSSchemaT } from "@/supabase/sos";
import { useState } from "react";

const useSOS = () => {
  const [sos, setSos] = useState<joinedSOSSchemaT[]>([]);
  const [activeSos, setActiveSos] = useState<joinedSOSSchemaT>();
  return { sos, setSos, activeSos, setActiveSos };
};

export default useSOS;
