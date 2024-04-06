export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001/api'

export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`,
    LOGOUT: `${BASE_URL}/auth/logout`
  },
  ROLE: {
    INDEX: `${BASE_URL}/roles`
  },
  USER: {
    INDEX: `${BASE_URL}/users`
  },
  PERMISSION: {},
  PRODUCT: {},
  ORDER: {},
  REVIEW: {},
  PRODUCT_TYPE: {},
  CITY: {},
  DELIVERY: {},
  PAYMENT: {},
  REPORT: {}
}
