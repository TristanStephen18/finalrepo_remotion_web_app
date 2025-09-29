// hooks/useLoadingMessages.ts
import { useState, useEffect } from "react";

const defaultMessages = [
  "⏳ Preparing your template...",
  "🙇 Sorry for the wait, still working on it...",
  "🚀 Almost there, thanks for your patience!",
];

export function useLoadingMessages(messages: string[] = defaultMessages) {
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoading, messages]);

  return {
    isLoading,
    setIsLoading,
    messageIndex,
    message: messages[messageIndex],
    setMessageIndex,
    messages: defaultMessages
  };
}
