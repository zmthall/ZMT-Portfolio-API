// /services/contact.service.ts

import { NoReplyEmail } from '../helpers/email/noReplyEmail.js';
import type {
  ContactSubmission,
  ContactSubmissionResult
} from '../types/contact.js';
import { submissionResult } from '../utils/contactSubmission.js';

export const submitContactForm = async (
  form: ContactSubmission
): Promise<ContactSubmissionResult> => {
  try {
    const emailer = new NoReplyEmail();
    const result = await emailer.sendContactEmail(form);

    return submissionResult({
      success: true,
      message: 'Contact form submitted successfully.',
        ...(result.messageId !== undefined
            ? { messageId: result.messageId }
        : {})
    });
  } catch (error) {
    console.error('Error sending contact email:', error);

    return submissionResult({
      success: false,
      error: 'Failed to send contact form.'
    });
  }
};