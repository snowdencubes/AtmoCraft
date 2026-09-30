/**
 * Email Notification Service (Demo)
 * For SIH Hackathon, this simulates dispatching emails (e.g. via Resend or SendGrid).
 * In production, you would plug in Resend.send() here.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export const emailService = {
  /**
   * Dispatches an email notification.
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log(`[EMAIL DISPATCHED] To: ${options.to} | Subject: ${options.subject}`);
    console.log(`[EMAIL BODY] ${options.body}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  },

  /**
   * Sends a welcome email when a user registers.
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to AtmoCraft LMS',
      body: `Hello ${name},\n\nYour account has been created and is pending Admin approval. You will receive another email once approved.`,
    });
  },

  /**
   * Sends an approval notification.
   */
  async sendApprovalEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Account Approved - AtmoCraft',
      body: `Hello ${name},\n\nYour account has been approved! You can now log in to the portal.`,
    });
  }
};
