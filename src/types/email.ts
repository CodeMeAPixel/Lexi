/**
 * Email-related type definitions
 */

export interface EmailSender {
    address: string;
    name?: string;
}

export interface EmailRecipient {
    address: string;
    name?: string;
}

export interface EmailTemplate {
    name: string;
    subject: string;
    html: string;
    text?: string;
}

export interface SendEmailOptions {
    to: string | EmailRecipient | (string | EmailRecipient)[];
    subject: string;
    html: string;
    text?: string;
    from?: EmailSender;
}

export interface SendEmailResult {
    success: boolean;
    error?: Error;
}

export interface EmailClient {
    sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
    emailTemplates?: {
        verification: (email: string, token: string) => EmailTemplate;
        resetPassword: (email: string, resetUrl: string) => EmailTemplate;
        welcome: (name: string | undefined, email: string) => EmailTemplate;
        waitlistConfirmation: (email: string) => EmailTemplate;
        waitlistUnsubscribe: (email: string) => EmailTemplate;
    };
}
