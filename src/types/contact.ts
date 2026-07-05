// /types/contact.ts

export interface ContactSubmissionResult { 
    success: boolean; 
    messageId?: string; 
    message?: string;
    error?: string 
};

export interface ContactSubmission {
  name: string
  company: string
  email: string
  phone: string
  projectType: string
  budget: string
  timeline: string
  subject: string
  message: string
  legitimateInquiry: boolean | string
  files: Express.Multer.File[]
}