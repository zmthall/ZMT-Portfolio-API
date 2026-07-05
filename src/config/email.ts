// /config/email.ts
import 'dotenv/config';

// Main Email
export const nodeMailerEmail = process.env.EMAIL_USERNAME;
export const nodeMailerPassword = process.env.EMAIL_PASSWORD;

// Branded Email
function requiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const brandedEmail = requiredEnv('BRANDED_EMAIL')
export const brandedEmailUser = requiredEnv('BRANDED_EMAIL_USER')
export const brandedEmailPassword = requiredEnv('BRANDED_EMAIL_PASSWORD')
export const brandedEmailHost = requiredEnv('BRANDED_EMAIL_HOST')
export const brandedEmailName = requiredEnv('BRANDED_EMAIL_NAME')
export const brandedEmailPort = Number(requiredEnv('BRANDED_EMAIL_PORT'))

export const contactFormTo = requiredEnv('CONTACT_FORM_TO')
