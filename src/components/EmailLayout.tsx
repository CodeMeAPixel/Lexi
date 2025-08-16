import React from 'react';

type Props = {
    children: React.ReactNode;
    preview?: string;
};

export default function EmailLayout({ children, preview }: Props) {
    return (
        <html>
            <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f7fafc', padding: 24 }}>
                {/* preview text for email clients */}
                {preview ? <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{preview}</div> : null}

                <div style={{ maxWidth: 680, margin: '0 auto', background: 'white', borderRadius: 8, padding: 28, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                    <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <img src="/logo.png" alt="Lexi" width={36} height={36} style={{ borderRadius: 8 }} />
                        <div style={{ fontWeight: 700, fontSize: 18 }}>Lexi</div>
                    </header>

                    <main>{children}</main>

                    <footer style={{ marginTop: 28, fontSize: 13, color: '#6B7280' }}>
                        <div>© {new Date().getFullYear()} Lexi — Your personal English coach</div>
                        <div style={{ marginTop: 6 }}>If you didn't request this email, you can ignore it.</div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
