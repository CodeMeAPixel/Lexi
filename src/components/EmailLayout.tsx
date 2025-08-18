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
          backgroundColor: "#f7fafc",
          padding: 24,
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
            borderRadius: 8,
            padding: 28,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
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
              src="https://beta.lexiapp.space/nameplate.png"
              alt="Lexi"
              width={36}
              height={36}
              style={{ borderRadius: 8 }}
            />
          </header>

          <main>{children}</main>

          <footer
            style={{
              marginTop: 28,
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            <div>© {new Date().getFullYear()} ByteBrush Studios</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
