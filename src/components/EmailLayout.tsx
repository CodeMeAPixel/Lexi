import React from "react";

type Props = {
  children: React.ReactNode;
  preview?: string;
};

export default function EmailLayout({ children, preview }: Props) {
  return (
    <html>
      <body
        style={{
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: "#f3f4f6",
          padding: 24,
          margin: 0,
        }}
      >
        {/* preview text for email clients */}
        {preview ? (
          <div
            style={{
              display: "none",
              maxHeight: 0,
              overflow: "hidden",
            }}
          >
            {preview}
          </div>
        ) : null}

        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            background: "white",
            borderRadius: 14,
            padding: 28,
            border: "1px solid #e5e7eb",
            boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <img
              src="https://lexiapp.space/nameplate.png"
              alt="Lexi"
              width={138}
              height={36}
              style={{ borderRadius: 8, objectFit: "contain" }}
            />
          </header>

          <main>{children}</main>

          <footer
            style={{
              marginTop: 28,
              fontSize: 13,
              color: "#6B7280",
              borderTop: "1px solid #E5E7EB",
              paddingTop: 14,
              lineHeight: 1.6,
            }}
          >
            <div>NodeByte LTD</div>
            <div>
              © {new Date().getFullYear()} NodeByte LTD. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
