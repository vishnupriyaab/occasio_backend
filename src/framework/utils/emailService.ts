
import nodemailer, { Transporter } from "nodemailer";
import { EmailConfig, EmailContent } from "../../interfaces/IEmail";

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
    private transporter: Transporter;
  
    constructor(config: EmailConfig) {
      this.transporter = nodemailer.createTransport(config);
    }
  
    async sendMail(content: EmailContent): Promise<any> {
      return await this.transporter.sendMail(content);
    }
  }
  
  export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<any>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<any>;
  }
  
  export class EmailService implements IEmailService {
    private emailTransport: EmailTransport;
    private senderEmail: string | undefined;
  
    constructor(private emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    }) {
      const config: EmailConfig = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      };
      
      this.emailTransport = new EmailTransport(config);
      this.senderEmail = emailConfig.user;
    }
  
    async sendOtpEmail(email: string, otp: string): Promise<any> {
      const content: EmailContent = {
        from: this.senderEmail!,
        to: email,
        subject: 'Verify your email in Occasio Event Management Team',
        html: EmailTemplates.getOtpTemplate(otp),
      };
  
      return await this.emailTransport.sendMail(content);
    }
  
    async sendPasswordResetEmail(email: string, resetLink: string): Promise<any> {
      const content: EmailContent = {
        from: this.senderEmail!,
        to: email,
        subject: 'Password Reset',
        html: EmailTemplates.getPasswordResetTemplate(resetLink),
      };
  
      return await this.emailTransport.sendMail(content);
    }
  }

  
// // Implementation of Email Service
// export class EmailService implements IEmailService {
//   constructor(private emailConfig: {
//     user: string | undefined;
//     pass: string | undefined;
//     frontendUrl: string | undefined;
//   }) {}

//   async sendOtpEmail(email: string, otp: string): Promise<any> {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: this.emailConfig.user,
//         pass: this.emailConfig.pass,
//       },
//     });

//     const mailOptions = {
//       from: this.emailConfig.user,
//       to: email,
//       subject: "verify your email in Occasio Event Management Team",
//       html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
//               <p>Hi <strong>Customer</strong>,</p>
//               <p>Your OTP for registration is: <strong>${otp}</strong></p>
//               <p>This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this OTP with anyone for security reasons.</p>
//               <p>If you did not request this OTP, please ignore this email.</p>
//               <br />
//               <p>Thank you,</p>
//               <p><strong>Occasio Event Management Team.</strong></p>
//             </div>`,
//     };
//     return transporter.sendMail(mailOptions);
//   }

//   async sendPasswordResetEmail(email: string, resetLink: string): Promise<any> {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: this.emailConfig.user,
//         pass: this.emailConfig.pass,
//       },
//     });

//     const mailOptions = {
//       to: email,
//       from: this.emailConfig.user,
//       subject: "Password Reset",
//       html: `<p>You requested a password reset. Click the link below to reset your password:</p>
//              <a href="${resetLink}">${resetLink}</a>`,
//     };

//     return transporter.sendMail(mailOptions);
//   }
// }

  