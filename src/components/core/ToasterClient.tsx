"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import CustomToast from "./CustomToast";

export default function ToasterClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing on the server to avoid hydration mismatch with the toast container
  if (!mounted) return null;

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{ duration: 4000 }}
      containerStyle={{
        // allow space under the navbar and center toasts
        top: 56,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}
      containerClassName="px-4 pointer-events-none"
    >
      {(t) => <CustomToast toast={t} />}
    </Toaster>
  );
}
