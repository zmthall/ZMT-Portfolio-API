import { EmailHelper } from "./emailHelper.js";
import { nodeMailerEmail, nodeMailerPassword } from "../../config/email.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export class MainEmail extends EmailHelper {
  constructor() {
    super({
      service: 'gmail',
      secure: true,
      auth: {
        user: nodeMailerEmail,
        pass: nodeMailerPassword,
      },
      tls: { rejectUnauthorized: false },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    } as SMTPTransport.Options);
  }
}