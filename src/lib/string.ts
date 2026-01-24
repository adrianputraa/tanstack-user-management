function isValidEmail(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return EMAIL_REGEX.test(email)
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export { isValidEmail, isValidString }
