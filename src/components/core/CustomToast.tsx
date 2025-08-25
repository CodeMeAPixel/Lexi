"use client";

import React from "react";
import type { Toast as HotToast } from "react-hot-toast";
import { toast as hotToast } from "react-hot-toast";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

// Extend Toast type to allow 'action' property
type Toast = HotToast & {
  action?: React.ReactNode | React.ReactNode[];
};

// Type for function-based toast messages
type ToastMessage = (toast: Toast) => React.ReactNode;

export default function CustomToast({ toast }: { toast: Toast }) {
  // Support all react-hot-toast options
  const message =
    typeof toast.message === "function"
      ? (toast.message as ToastMessage)(toast)
      : toast.message;

  // Allow custom icon, fallback to type-based icon
  const getToastStyles = () => {
    if (toast.icon) {
      return {
        bg: "bg-grey-80 backdrop-blur-xl panel-wide",
        border: "border-grey-20/80",
        shadow: "shadow-xl shadow-grey-50/10",
        icon: toast.icon,
        accent: "bg-grey-50",
      };
    }
    switch (toast.type) {
      case "custom":
        return {
          bg: "bg-grey-80 backdrop-blur-xl panel-wide",
          border: "border-green-200/80",
          shadow: "shadow-xl shadow-green-500/10",
          icon: <HiCheckCircle className="text-green-600" size={20} />,
          accent: "bg-green-500",
        };
      case "success":
        return {
          bg: "bg-grey-80 backdrop-blur-xl panel-wide",
          border: "border-green-200/80",
          shadow: "shadow-xl shadow-green-500/10",
          icon: <HiCheckCircle className="text-green-600" size={20} />,
          accent: "bg-green-500",
        };
      case "error":
        return {
          bg: "bg-grey-80 backdrop-blur-xl panel-wide",
          border: "border-red-200/80",
          shadow: "shadow-xl shadow-red-500/10",
          icon: <HiXCircle className="text-red-600" size={20} />,
          accent: "bg-red-500",
        };
      case "loading":
        return {
          bg: "bg-grey-80 backdrop-blur-xl panel-wide",
          border: "border-blue-200/80",
          shadow: "shadow-xl shadow-blue-500/10",
          icon: (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-600"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-30"
                />
                <path
                  d="M22 12a10 10 0 00-10-10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ),
          accent: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-grey-80 backdrop-blur-xl panel-wide",
          border: "border-gray-200/80",
          shadow: "shadow-xl shadow-gray-500/10",
          icon: <HiInformationCircle className="text-gray-600" size={20} />,
          accent: "bg-gray-500",
        };
    }
  };

  const styles = getToastStyles();

  // Support custom style/className/ariaProps/position
  const mergedClassName = [
    "relative max-w-sm p-4 pr-14 pointer-events-auto border rounded-2xl shadow-2xl flex items-center gap-4",
    styles.bg,
    styles.border,
    styles.shadow,
    toast.className || "",
  ].join(" ");

  const mergedStyle = {
    ...toast.style,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1,
        }}
        role={toast.ariaProps?.role || "status"}
        aria-live={toast.ariaProps?.["aria-live"] || "polite"}
        className={mergedClassName}
        style={mergedStyle}
        data-position={toast.position}
      >
        {/* Animated accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-1 ${styles.accent} rounded-full`}
        />

        {/* Icon container */}
        <div className="flex-shrink-0">
          <div className="p-1 rounded-full bg-white/20">{styles.icon}</div>
        </div>

        {/* Message content */}
        <div className="flex-1">
          <div className="text-sm font-medium leading-relaxed text-white">
            {message}
          </div>
          {/* Render custom action buttons if present */}
          {toast.action && (
            <div className="flex gap-2 mt-3">
              {Array.isArray(toast.action)
                ? toast.action.map((btn, i) => (
                    <React.Fragment key={i}>{btn}</React.Fragment>
                  ))
                : toast.action}
            </div>
          )}
        </div>

        {/* SIMPLE ASS CLOSE BUTTON - ABSOLUTE POSITIONED */}
        <button
          onClick={() => hotToast.dismiss(toast.id)}
          className="absolute ml-3 text-black transition-colors duration-200 transform -translate-y-1/2 pointer-events-auto top-1/2 right-3 hover:text-red-400"
          style={{
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontSize: "14px",
          }}
        >
          ✕
        </button>

        {/* Progress bar for auto-dismiss */}
        {toast.duration && toast.duration > 0 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: toast.duration / 1000,
              ease: "linear",
            }}
            className="absolute bottom-0 left-0 h-1 origin-left rounded-full bg-white/30"
            style={{ width: "100%" }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
