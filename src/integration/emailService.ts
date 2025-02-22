import nodemailer, { Transporter } from "nodemailer";
import {
  EmailConfig,
  EmailContent,
  IEmailService,
} from "../interfaces/integration/IEmail";

export class EmailTemplates {
  static getOtpTemplate(otp: string): string {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Hi <strong>Customer</strong>,</p>
          <p>Your OTP for registration is: <strong>${otp}</strong></p>
          <p>This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this OTP with anyone for security reasons.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <br />
          <p>Thank you,</p>
          <p><strong>Occasio Event Management Team.</strong></p>
        </div>
      `;
  }

  static getPasswordResetTemplate(resetLink: string): string {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
        </div>
      `;
  }
}

export class EmailTransport {
  private _transporter: Transporter;

  constructor(config: EmailConfig) {
    this._transporter = nodemailer.createTransport(config);
  }

  async sendMail(content: EmailContent): Promise<any> {
    return await this._transporter.sendMail(content);
  }
}

export class EmailService implements IEmailService {
  private _emailTransport: EmailTransport;
  private _senderEmail: string | undefined;

  constructor(
    private emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    }
  ) {
    const config: EmailConfig = {
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    };

    this._emailTransport = new EmailTransport(config);
    this._senderEmail = emailConfig.user;
  }

  async sendOtpEmail(email: string, otp: string): Promise<string> {
    const content: EmailContent = {
      from: this._senderEmail!,
      to: email,
      subject: "Verify your email in Occasio Event Management Team",
      html: EmailTemplates.getOtpTemplate(otp),
    };

    return await this._emailTransport.sendMail(content);
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<string> {
    const content: EmailContent = {
      from: this._senderEmail!,
      to: email,
      subject: "Password Reset",
      html: EmailTemplates.getPasswordResetTemplate(resetLink),
    };

    return await this._emailTransport.sendMail(content);
  }
}
