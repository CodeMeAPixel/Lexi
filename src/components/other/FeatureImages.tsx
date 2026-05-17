"use client";

export function FeatureImageSecurity() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Background */}
            <path d="M80 0 L140 32 V72 C140 80 132 88 124 88 H36 C28 88 20 80 20 72 V32 L80 0 Z" fill="url(#gradShield)" stroke="#86efac" strokeWidth="1.6" />

            {/* Lock */}
            <rect x="64" y="36" width="32" height="28" rx="4" fill="#86efac" />
            <rect x="76" y="44" width="8" height="12" rx="2" fill="rgba(0,0,0,0.2)" />

            <defs>
                <linearGradient id="gradShield" x1="80" y1="0" x2="80" y2="88" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#86efac" stopOpacity="0.06" />
                    <stop offset="1" stopColor="#86efac" stopOpacity="0.12" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function FeatureImageUI() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                {/* Header Bar */}
                <rect x="8" y="8" width="144" height="16" rx="8" fill="rgba(255,255,255,0.04)" />

                {/* Left Panel */}
                <rect x="8" y="32" width="70" height="40" rx="8" fill="rgba(255,255,255,0.03)" />
                <circle cx="18" cy="42" r="2" fill="rgba(255,255,255,0.2)" />
                <circle cx="30" cy="42" r="2" fill="rgba(255,255,255,0.2)" />
                <circle cx="42" cy="42" r="2" fill="rgba(255,255,255,0.2)" />

                {/* Right Panel */}
                <rect x="80" y="32" width="62" height="12" rx="6" fill="rgba(255,255,255,0.03)" />
                <rect x="80" y="50" width="62" height="12" rx="6" fill="rgba(255,255,255,0.02)" />
            </g>
        </svg>
    );
}

export function FeatureImagePractice() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                {/* Practice Box */}
                <rect x="14" y="14" width="46" height="16" rx="4" fill="url(#gradPractice)" stroke="#60a5fa" strokeWidth="1.2" />

                {/* Checklist Lines */}
                <rect x="14" y="36" width="120" height="8" rx="3" fill="rgba(255,255,255,0.03)" />
                <rect x="14" y="50" width="88" height="8" rx="3" fill="rgba(255,255,255,0.02)" />

                {/* Checkmark Icon */}
                <path d="M104 22l8 8 16-16" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="112" cy="28" r="2" fill="#60a5fa" />
            </g>

            <defs>
                <linearGradient id="gradPractice" x1="14" y1="14" x2="60" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60a5fa" stopOpacity="0.06" />
                    <stop offset="1" stopColor="#60a5fa" stopOpacity="0.12" />
                </linearGradient>
            </defs>
        </svg>
    );
}
