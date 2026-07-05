import type { ContactSubmissionResult } from "../types/contact.js"

export const submissionResult = ({
  success,
  messageId,
  message,
  error
}: ContactSubmissionResult): ContactSubmissionResult => {
  const result: ContactSubmissionResult = {
    success
  }

  if (messageId !== undefined) {
    result.messageId = messageId
  }

  if (message !== undefined) {
    result.message = message
  }

  if (error !== undefined) {
    result.error = error
  }

  return result
}