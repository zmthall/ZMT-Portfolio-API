import { brandedEmailHost, brandedEmailPassword, brandedEmailPort, brandedEmailUser, brandedEmailName, brandedEmail, contactFormTo } from '../../config/email.js';
import { formatDateTime } from '../../utils/time.js';
import { EmailHelper } from './emailHelper.js';

export class NoReplyEmail extends EmailHelper {
    constructor() {
        super({
            host: brandedEmailHost,
            port: brandedEmailPort,
            secure: true, // SSL
            auth: {
                user: brandedEmailUser,
                pass: brandedEmailPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    sendPasswordResetEmail = async (email: string, resetLink: string) => {
        return await this.sendEmail({
            from: `"${brandedEmailName}" <${brandedEmail}>`,
            to: email,
            subject: 'Reset Your Password - Golden Gate Manor',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin: 0;">Password Reset Request</h1>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                    We received a request to reset your password for your ${brandedEmailName} account.
                    </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                    style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Your Password
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    This link will expire in 1 hour for security purposes.
                    </p>
                    <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    If you didn't request this password reset, please ignore this email.
                    </p>
                </div>
            </div>
            `
        });          
    }; 

    sendVerificationLinkEmail = async (email: string, verificationLink: string) => {
        return await this.sendEmail({
            from: `"${brandedEmailName}" <${brandedEmail}>`,
            to: email,
            subject: 'Verify Your Email Address - Golden Gate Manor',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin: 0;">Email Verification Required</h1>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                    Thank you for creating your ${brandedEmailName} account. Please verify your email address to complete your registration.
                    </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                    style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Verify Email Address
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    This verification link will expire in 24 hours for security purposes.
                    </p>
                    <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    If you didn't create this account, please ignore this email.
                    </p>
                </div>
            </div>
            `
        })
    }

    sendContactEmail = async (contact: {
        name: string
        company?: string
        email: string
        phone?: string
        projectType?: string
        budget?: string
        timeline?: string
        subject: string
        message: string
        files?: Express.Multer.File[]
    }) => {
        const attachments = contact.files?.map((file) => ({
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype
        }))


        return await this.sendEmail({
            from: `"${brandedEmailName}" <${brandedEmail}>`,
            to: contactFormTo,
            replyTo: contact.email,
            subject: `New Portfolio Contact: ${contact.subject} on ${formatDateTime(new Date())}`,
            html: `
                <h2>New Portfolio Contact Submission</h2>

                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
                ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
                ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
                ${contact.projectType ? `<p><strong>Project Type:</strong> ${contact.projectType}</p>` : ''}
                ${contact.budget ? `<p><strong>Budget:</strong> ${contact.budget}</p>` : ''}
                ${contact.timeline ? `<p><strong>Timeline:</strong> ${contact.timeline}</p>` : ''}

                <hr />

                <p><strong>Subject:</strong> ${contact.subject}</p>

                <h3>Message</h3>
                <p style="white-space: pre-wrap;">${contact.message}</p>

                <hr />

                <p style="font-size: 12px; color: #666;">
                    Submitted from zmtportfolio.com contact form.
                </p>
            `,
            ...(attachments && attachments.length > 0
                ? { attachments }
            : {})
        })
    }
}
