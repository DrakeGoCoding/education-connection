class NotificationUtils {
  /**
   * Extracts email addresses mentioned in the given content.
   *
   * @param content - The content from which to extract mentioned email addresses.
   *
   * @returns An array of email addresses mentioned in the content.
   *
   * @example
   * const mentionedEmails = extractMentionedEmails('Hello students! @student1@gmail.com @student2@gmail.com');
   * console.log(mentionedEmails); // Output: ['student1@gmail.com', 'student2@gmail.com']
   */
  static extractMentionedEmails(content: string): string[] {
    const emailRegex = /@[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    return content.match(emailRegex)?.map((email) => email.slice(1)) || [];
  }
}

export default NotificationUtils;
