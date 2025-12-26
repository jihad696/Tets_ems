export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateMobile(mobile) {
  // Must be in international format, e.g., +14155552671
  return /^\+\d{10,}$/.test(mobile)
}
