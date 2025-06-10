"use server";

import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import { discordantClient } from "@/lib/discordant-client";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderName = formData.get("senderName");
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // simple server-side validation
  if (!validateString(senderName, 100)) {
    return {
      error: "Invalid sender name",
    };
  }
  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  let data;
  let discordantResponse;
  
  try {
    // Get request headers for additional context
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';

    // Send to Discordant first (this triggers n8n workflow)
    try {
      discordantResponse = await discordantClient.sendContactFormMessage({
        name: senderName as string,
        email: senderEmail as string,
        message: message as string,
        page: '/contact',
        sessionId: `contact-${Date.now()}`, // In production, this would come from session management
        userAgent
      });
    } catch (discordantError) {
      console.error('Failed to send to Discordant:', discordantError);
      // Continue with email even if Discordant fails
    }

    // Using simple HTML instead of React Email components for Next.js 15 compatibility
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Message</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
            <h2 style="color: #007bff; margin-top: 0;">New Contact Form Message</h2>
            <p style="font-size: 16px;">You received the following message from your portfolio contact form:</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="font-size: 14px; color: #666;">
              <strong>From:</strong> ${senderName} (${senderEmail})
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              This message was sent from your portfolio website contact form.
              ${discordantResponse ? 'Also forwarded to Discordant for AI processing.' : 'Note: Discordant integration unavailable.'}
            </p>
          </div>
        </body>
      </html>
    `;

    data = await resend.emails.send({
      from: "Portfolio Contact <noreply@kendev.co>",
      to: process.env.EMAIL_ADDRESS_TO ?? "",
      subject: `New Portfolio Contact: ${senderName}`,
      replyTo: senderEmail as string,
      html: htmlContent,
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
    discordantResponse,
  };
};
