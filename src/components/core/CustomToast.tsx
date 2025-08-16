"use client";

import React from "react";
import type { Toast } from "react-hot-toast";
import { toast as hotToast } from "react-hot-toast";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function CustomToast({ toast }: { toast: Toast }) {
    const message = typeof toast.message === "function" ? (toast.message as any)(toast) : toast.message;

    return (
        <div
            role="status"
            className="flex items-start max-w-md gap-3 p-3 text-white border rounded-md shadow-lg border-white/6 bg-grey-90/80"
        >
            <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <HiCheckCircle className="text-green-400 bg-grey-100" size={18} />}
                {toast.type === "error" && <HiXCircle className="text-red-400 bg-grey-100" size={18} />}
                {toast.type === "loading" && (
                    <svg className="animate-spin text-white/80" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                )}
            </div>

            <div className="flex-1 text-sm leading-tight">{message}</div>

            <div className="flex items-start">
                <button
                    onClick={() => hotToast.dismiss(toast.id)}
                    aria-label="Dismiss toast"
                    className="ml-2 text-white/60 hover:text-white focus:outline-none"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
