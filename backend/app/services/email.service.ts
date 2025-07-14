import mail from '@adonisjs/mail/services/main'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'
import ContactRequest from '#models/contact_request'

export interface EmailOptions {
  to: string | string[]
  from?: string
  subject: string
  text?: string
  html?: string
  templateView?: string
  templateData?: any
  replyTo?: string
  attachments?: any[]
}

export interface WelcomeEmailData {
  user: User
  loginUrl?: string
}

export interface PasswordResetEmailData {
  user: User
  code: string
  expiresInMinutes?: number
}

export interface ContactConfirmationEmailData {
  contactRequest: ContactRequest
}

export interface InvoiceEmailData {
  to: string
  invoiceNumber: string
  companyName: string
  amount: number
  currency: string
  dueDate: string
  downloadUrl?: string
}

export interface NotificationEmailData {
  to: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

export interface CompanyInviteEmailData {
  to: string
  companyName: string
  inviterName: string
  inviteUrl: string
  expiresInDays?: number
}

export class EmailService {
  private readonly defaultFromAddress = 'Salair <noreply@salair.fr>'
  private readonly supportFromAddress = 'Support Salair <contact@salair.fr>'

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await mail.send((message) => {
        // Handle both single string and array of recipients
        if (Array.isArray(options.to)) {
          options.to.forEach((recipient) => message.to(recipient))
        } else {
          message.to(options.to)
        }

        message.from(options.from || this.defaultFromAddress).subject(options.subject)

        if (options.replyTo) {
          message.replyTo(options.replyTo)
        }

        if (options.text) {
          message.text(options.text)
        }

        if (options.html) {
          message.html(options.html)
        }

        if (options.templateView && options.templateData) {
          message.htmlView(options.templateView, options.templateData)
        }

        if (options.attachments && options.attachments.length > 0) {
          options.attachments.forEach((attachment) => {
            message.attach(attachment)
          })
        }
      })

      logger.info('📧 Email sent successfully', {
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        template: options.templateView,
      })
    } catch (error) {
      logger.error('❌ Failed to send email', {
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    await this.sendEmail({
      to: data.user.email,
      subject: 'Bienvenue sur Salair !',
      templateView: 'mails/welcome',
      templateData: {
        user: data.user,
        loginUrl: data.loginUrl || 'https://app.salair.fr/login',
      },
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    await this.sendEmail({
      to: data.user.email,
      subject: 'Demande de réinitialisation de mot de passe',
      templateView: 'mails/reset_password',
      templateData: {
        user: data.user,
        code: data.code,
        expiresInMinutes: data.expiresInMinutes || 15,
      },
    })
  }

  /**
   * Send contact confirmation email
   */
  async sendContactConfirmationEmail(data: ContactConfirmationEmailData): Promise<void> {
    await this.sendEmail({
      to: data.contactRequest.email,
      subject: `[#${data.contactRequest.id}] Demande de contact`,
      templateView: 'mails/contact',
      templateData: {
        firstName: data.contactRequest.firstName,
        lastName: data.contactRequest.lastName,
        contactRequest: data.contactRequest,
      },
    })
  }

  /**
   * Send support response email
   */
  async sendSupportResponseEmail(to: string, message?: string): Promise<void> {
    const defaultMessage = `Bonjour,

Votre demande de contact a bien été reçue. Elle sera traitée rapidement par un membre de notre équipe.

Cordialement,
L'équipe Salair`

    await this.sendEmail({
      to,
      from: this.supportFromAddress,
      subject: 'Demande de contact reçue !',
      text: message || defaultMessage,
    })
  }

  /**
   * Send invoice email to customer
   */
  async sendInvoiceEmail(data: InvoiceEmailData): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Facture ${data.invoiceNumber} - ${data.companyName}`,
      templateView: 'mails/invoice',
      templateData: {
        invoiceNumber: data.invoiceNumber,
        companyName: data.companyName,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.dueDate,
        downloadUrl: data.downloadUrl,
      },
    })
  }

  /**
   * Send invoice reminder email
   */
  async sendInvoiceReminderEmail(data: InvoiceEmailData & { daysOverdue: number }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Rappel - Facture ${data.invoiceNumber} échue depuis ${data.daysOverdue} jour(s)`,
      templateView: 'mails/invoice_reminder',
      templateData: {
        invoiceNumber: data.invoiceNumber,
        companyName: data.companyName,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.dueDate,
        daysOverdue: data.daysOverdue,
        downloadUrl: data.downloadUrl,
      },
    })
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(data: NotificationEmailData): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: data.title,
      templateView: 'mails/notification',
      templateData: {
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        actionText: data.actionText,
      },
    })
  }

  /**
   * Send company invitation email
   */
  async sendCompanyInviteEmail(data: CompanyInviteEmailData): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Invitation à rejoindre ${data.companyName} sur Salair`,
      templateView: 'mails/company_invite',
      templateData: {
        companyName: data.companyName,
        inviterName: data.inviterName,
        inviteUrl: data.inviteUrl,
        expiresInDays: data.expiresInDays || 7,
      },
    })
  }

  /**
   * Send subscription renewal reminder
   */
  async sendSubscriptionRenewalEmail(user: User, daysUntilExpiry: number): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: `Votre abonnement Salair expire dans ${daysUntilExpiry} jour(s)`,
      templateView: 'mails/subscription_renewal',
      templateData: {
        user,
        daysUntilExpiry,
        renewUrl: 'https://app.salair.fr/subscription',
      },
    })
  }

  /**
   * Send subscription cancelled email
   */
  async sendSubscriptionCancelledEmail(user: User, endDate: string): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: "Confirmation d'annulation de votre abonnement Salair",
      templateView: 'mails/subscription_cancelled',
      templateData: {
        user,
        endDate,
        reactivateUrl: 'https://app.salair.fr/subscription',
      },
    })
  }

  /**
   * Send bulk emails to multiple recipients
   */
  async sendBulkEmails(recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<void> {
    const promises = recipients.map((recipient) =>
      this.sendEmail({
        ...options,
        to: recipient,
      })
    )

    try {
      await Promise.all(promises)
      logger.info('📧 Bulk emails sent successfully', {
        recipientCount: recipients.length,
        subject: options.subject,
      })
    } catch (error) {
      logger.error('❌ Failed to send bulk emails', {
        recipientCount: recipients.length,
        subject: options.subject,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * Send newsletter email
   */
  async sendNewsletterEmail(recipients: string[], subject: string, content: string): Promise<void> {
    await this.sendBulkEmails(recipients, {
      subject,
      templateView: 'mails/newsletter',
      templateData: {
        content,
        unsubscribeUrl: 'https://app.salair.fr/newsletter/unsubscribe',
      },
    })
  }

  /**
   * Send marketing email
   */
  async sendMarketingEmail(
    recipients: string[],
    subject: string,
    templateData: any
  ): Promise<void> {
    await this.sendBulkEmails(recipients, {
      subject,
      templateView: 'mails/marketing',
      templateData: {
        ...templateData,
        unsubscribeUrl: 'https://app.salair.fr/newsletter/unsubscribe',
      },
    })
  }

  /**
   * Send system alert email to administrators
   */
  async sendSystemAlertEmail(message: string, details?: any): Promise<void> {
    const adminEmails = ['admin@salair.fr', 'tech@salair.fr'] // Could be from config

    await this.sendBulkEmails(adminEmails, {
      from: 'System Alert <system@salair.fr>',
      subject: '🚨 System Alert - Salair',
      templateView: 'mails/system_alert',
      templateData: {
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    })
  }

  /**
   * Send email verification for new email addresses
   */
  async sendEmailVerificationEmail(
    email: string,
    verificationCode: string,
    user?: User
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Vérification de votre adresse email',
      templateView: 'mails/email_verification',
      templateData: {
        user,
        verificationCode,
        verificationUrl: `https://app.salair.fr/verify-email?code=${verificationCode}`,
        expiresInMinutes: 60,
      },
    })
  }

  /**
   * Send account deletion confirmation
   */
  async sendAccountDeletionEmail(user: User): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: 'Confirmation de suppression de votre compte Salair',
      templateView: 'mails/account_deletion',
      templateData: {
        user,
        supportEmail: 'contact@salair.fr',
      },
    })
  }

  /**
   * Test email sending functionality
   */
  async sendTestEmail(to: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: '✅ Test Email - Salair',
      text: 'This is a test email from Salair. If you receive this, the email service is working correctly!',
      html: '<p>This is a <strong>test email</strong> from Salair. If you receive this, the email service is working correctly!</p>',
    })
  }
}

export default new EmailService()
