import { renderEmailToHtml } from "./renderHtml";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { EmailTemplateProps } from "./template";

import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

import {
    EmailClient,
    EmailSender,
    EmailRecipient,
    EmailTemplate,
    SendEmailOptions,
    SendEmailResult,
} from "@/types/email";

/**
 * Implementation of the EmailClient interface using Microsoft Graph API
 *
 * @class EmailClientImpl
 * @implements {EmailClient}
 * @description
 * This class provides email sending capabilities using Microsoft Graph API.
 * It implements the singleton pattern to ensure only one instance exists.
 *
 * @example
 * // Get the email client instance
 * const client = EmailClientImpl.getInstance();
 *
 * // Send an email
 * await client.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Hello',
 *   text: 'Plain text content',
 *   html: '<p>HTML content</p>'
 * });
 */
class EmailClientImpl implements EmailClient {
    /**
     * Singleton instance of the email client
     * @private
     * @static
     * @type {EmailClientImpl}
     */
    private static instance: EmailClientImpl;

    /**
     * Microsoft Graph client for API calls
     * @private
     * @type {Client}
     */
    private graphClient: Client;

    /**
     * Default sender configuration
     * @private
     * @type {EmailSender}
     */
    private defaultFrom: EmailSender;

    /**
     * Creates an instance of EmailClientImpl.
     * @private
     * @constructor
     * @description
     * Initializes the Microsoft Graph client with credentials from environment variables
     * and sets up the default sender information.
     */
    private constructor() {
        // Create the credential
        const credential = new ClientSecretCredential(
            process.env.AZURE_APP_TENANT_ID!,
            process.env.AZURE_APP_CLIENT_ID!,
            process.env.AZURE_APP_CLIENT_SECRET!
        );

        // Create the authentication provider
        const authProvider = new TokenCredentialAuthenticationProvider(
            credential,
            {
                scopes: ["https://graph.microsoft.com/.default"],
            }
        );

        // Create the Graph client
        this.graphClient = Client.initWithMiddleware({
            authProvider,
        });

        // Set default sender
        this.defaultFrom = {
            address: process.env.DEFAULT_FROM_EMAIL || "noreply@lexiapp.space",
            name: process.env.DEFAULT_FROM_NAME || "Lexicon",
        };
    }

    /**
     * Gets the singleton instance of EmailClientImpl
     * @public
     * @static
     * @returns {EmailClientImpl} The singleton instance
     */
    public static getInstance(): EmailClientImpl {
        if (!EmailClientImpl.instance) {
            EmailClientImpl.instance = new EmailClientImpl();
        }
        return EmailClientImpl.instance;
    }

    /**
     * Collection of email template generators
     * @public
     * @type {Object}
     */
    emailTemplates = {
        // account-related templates
        verification: (email: string, token: string): EmailTemplate => {
            const props: EmailTemplateProps["verification"] = { email, token };
            const text = `Please verify your email: ${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
            return {
                name: "verification",
                subject: "Verify your email",
                text,
                html: renderEmailToHtml("verification", props),
            };
        },
        resetPassword: (email: string, resetUrl: string): EmailTemplate => {
            const props: EmailTemplateProps["resetPassword"] = {
                email,
                resetUrl,
            };
            const text = `Reset your password: ${resetUrl}`;
            return {
                name: "resetPassword",
                subject: "Reset your password",
                text,
                html: renderEmailToHtml("resetPassword", props),
            };
        },
        welcome: (name: string | undefined, email: string): EmailTemplate => {
            const props: EmailTemplateProps["welcome"] = { name, email };
            const text = `Welcome to Lexi${name ? `, ${name}` : ""}!`;
            return {
                name: "welcome",
                subject: "Welcome to Lexi",
                text,
                html: renderEmailToHtml("welcome", props),
            };
        },
        // waitlist-related templates
        waitlistConfirmation: (email: string): EmailTemplate => {
            const props: EmailTemplateProps["waitlistConfirmation"] = { email };
            const text = `Welcome to the Lexi waitlist! You've been added with the email: ${email}`;
            return {
                name: "waitlistConfirmation",
                subject: "Welcome to the Lexi waitlist!",
                text,
                html: renderEmailToHtml("waitlistConfirmation", props),
            };
        },
        waitlistUnsubscribe: (email: string): EmailTemplate => {
            const props: EmailTemplateProps["waitlistUnsubscribe"] = { email };
            const text = `You have been successfully removed from the Lexi waitlist.`;
            return {
                name: "waitlistUnsubscribe",
                subject: "You have been unsubscribed",
                text,
                html: renderEmailToHtml("waitlistUnsubscribe", props),
            };
        },
    };

    /**
     * Sends an email using Microsoft Graph API
     *
     * @public
     * @async
     * @param {SendEmailOptions} options - The email sending options
     * @returns {Promise<SendEmailResult>} Result of the email sending operation
     *
     * @example
     * // Send a simple email
     * const result = await emailClient.sendEmail({
     *   to: 'user@example.com',
     *   subject: 'Hello',
     *   text: 'Plain text version',
     *   html: '<p>HTML version</p>'
     * });
     *
     * @example
     * // Send an email to multiple recipients with a custom sender
     * const result = await emailClient.sendEmail({
     *   to: ['user1@example.com', 'user2@example.com'],
     *   subject: 'Team Update',
     *   text: 'Plain text version',
     *   html: '<p>HTML version</p>',
     *   from: {
     *     address: 'team@octohub.dev',
     *     name: 'OctoHub Team'
     *   }
     * });
     */
    async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
        try {
            const sender = options.from || this.defaultFrom;

            // Convert recipients to the correct format
            const toRecipients = Array.isArray(options.to)
                ? options.to.map((recipient: string | EmailRecipient) =>
                      this.normalizeRecipient(recipient)
                  )
                : [this.normalizeRecipient(options.to)];

            // Create the message
            const message = {
                subject: options.subject,
                body: {
                    contentType: "HTML",
                    content: options.html,
                },
                from: {
                    emailAddress: {
                        address: sender.address,
                        name: sender.name,
                    },
                },
                toRecipients,
            };

            // Send the email using the specified sender
            await this.graphClient
                .api(`/users/${sender.address}/sendMail`)
                .post({
                    message,
                    saveToSentItems: true,
                });

            return { success: true };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new Error("Failed to send email"),
            };
        }
    }

    /**
     * Normalizes recipient format for Microsoft Graph API
     *
     * @private
     * @param {string | EmailRecipient} recipient - The recipient email or object
     * @returns {Object} Normalized recipient object for Graph API
     */
    private normalizeRecipient(recipient: string | EmailRecipient): {
        emailAddress: { address: string; name?: string };
    } {
        if (typeof recipient === "string") {
            return {
                emailAddress: {
                    address: recipient,
                },
            };
        }
        return {
            emailAddress: {
                address: recipient.address,
                name: recipient.name,
            },
        };
    }
}

/**
 * Singleton instance of the email client
 * @type {EmailClientImpl}
 */
export const emailClient = EmailClientImpl.getInstance();

/**
 * Exported email functions for convenience
 * Note: bind sendEmail so `this` inside the method refers to the client instance.
 */
export const sendEmail = emailClient.sendEmail.bind(emailClient);
export const emailTemplates = emailClient.emailTemplates;
