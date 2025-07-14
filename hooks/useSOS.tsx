import { joinedSOSSchemaT } from "@/supabase/sos";
import { sosResponseT } from "@/types";
import { useEffect, useState } from "react";

const useSOS = () => {
  const [sos, setSos] = useState<joinedSOSSchemaT[]>([]);
  const [activeSos, setActiveSos] = useState<joinedSOSSchemaT>();
  const [lastSosResponse, setLastSosResponse] = useState<sosResponseT>();

  useEffect(() => {
    if (lastSosResponse && sos) {
      const lastSos = sos.find((item) => item.id === lastSosResponse.sos);
      lastSos && !lastSos.resolved && setActiveSos(lastSos);
    } else {
      activeSos && setActiveSos(undefined);
    }
  }, [lastSosResponse, sos]);
  return {
    sos,
    setSos,
    activeSos,
    setActiveSos,
    lastSosResponse,
    setLastSosResponse,
  };
};

export default useSOS;
