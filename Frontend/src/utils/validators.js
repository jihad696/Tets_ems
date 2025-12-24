export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateMobile(mobile) {
  return /^\d{10,}$/.test(mobile.replace(/\D/g, ''))
}
