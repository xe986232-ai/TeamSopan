"use client";

import { useEffect, useState } from "react";
import WelcomePreviewSection from "./WelcomePreviewSection";
import { WELCOME_NAME_KEY } from "@/lib/welcome";

export default function WelcomeGate() {
  const [name, setName] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(WELCOME_NAME_KEY);
    if (stored) {
      setName(stored);
      sessionStorage.removeItem(WELCOME_NAME_KEY);
    }
  }, []);

  if (!name) return null;

  return <WelcomePreviewSection name={name} onFinish={() => setName(null)} />;
}
