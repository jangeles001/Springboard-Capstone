import { useState, useCallback } from "react";

export function useNotification(duration = 5000){
    const [ message, setMessage ] = useState(null);

    const notify = useCallback((message)=> {
    setMessage(message);
    setTimeout(() => setMessage(null), duration);
  }, [duration])

  return { message, notify }
}