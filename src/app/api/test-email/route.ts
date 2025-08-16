import { NextRequest, NextResponse } from "next/server";
import { emailClient, emailTemplates, sendEmail } from "@/lib/email";
import { renderEmailTemplate } from "@/lib/email/server-rendering";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testType, email, name } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        let result;
        let template;

        switch (testType) {
            case "welcome":
                template = emailTemplates.welcome(name, email);
                break;
            case "verification":
                const token = "test-verification-token-" + Date.now();
                template = emailTemplates.verification(email, token);
                break;
            case "resetPassword":
                const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset?token=test-reset-token-${Date.now()}`;
                template = emailTemplates.resetPassword(email, resetUrl);
                break;
                // Test simple email without templates
                result = await sendEmail({
                    to: email,
                    subject: "Simple Test Email",
                    html: "<h1>Simple Test</h1><p>This is a simple test email.</p>",
                    text: "This is a simple test email.",
                });
                return NextResponse.json({
                    success: true,
                    message: "Simple test email sent",
                    result,
                });
            default:
                return NextResponse.json(
                    {
                        error: "Invalid test type. Use: welcome, verification, resetPassword, custom, or simple",
                    },
                    { status: 400 }
                );
        }

        // Send the template email
        result = await sendEmail({
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html,
        });

        // Also test server-side rendering
        let renderedHtml: string | undefined;
        try {
            switch (testType) {
                case "welcome":
                    renderedHtml = renderEmailTemplate("welcome", {
                        name,
                        email,
                    });
                    break;
                case "verification":
                    const token = "test-verification-token-" + Date.now();
                    renderedHtml = renderEmailTemplate("verification", {
                        email,
                        token,
                    });
                    break;
                case "resetPassword":
                    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset?token=test-reset-token-${Date.now()}`;
                    renderedHtml = renderEmailTemplate("resetPassword", {
                        email,
                        resetUrl,
                    });
                    break;
            }
        } catch (renderError) {
            console.error("Server-side rendering error:", renderError);
        }

        return NextResponse.json({
            success: true,
            message: `${testType} test email sent successfully`,
            result,
            template: {
                name: template.name,
                subject: template.subject,
                hasHtml: !!template.html,
                hasText: !!template.text,
            },
            serverRendering: {
                success: !!renderedHtml,
                htmlLength: renderedHtml?.length || 0,
            },
        });
    } catch (error) {
        console.error("Email test error:", error);
        return NextResponse.json(
            {
                error: "Failed to send test email",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return email system status and available test types
    return NextResponse.json({
        status: "Email system ready for testing",
        availableTests: [
            {
                type: "simple",
                description: "Test basic email sending (no templates)",
                requiredFields: ["email"],
            },
            {
                type: "welcome",
                description: "Test welcome email template",
                requiredFields: ["email", "name (optional)"],
            },
            {
                type: "verification",
                description: "Test email verification template",
                requiredFields: ["email"],
            },
            {
                type: "resetPassword",
                description: "Test password reset template",
                requiredFields: ["email"],
            },
            {
                type: "custom",
                description: "Test custom HTML email",
                requiredFields: ["email"],
            },
        ],
        environment: {
            hasAzureConfig: !!(
                process.env.AZURE_APP_TENANT_ID &&
                process.env.AZURE_APP_CLIENT_ID &&
                process.env.AZURE_APP_CLIENT_SECRET
            ),
            defaultFromEmail:
                process.env.DEFAULT_FROM_EMAIL || "noreply@lexiapp.space",
            appUrl: process.env.NEXT_PUBLIC_APP_URL,
        },
    });
}
