export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001/api'

export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`,
    LOGOUT: `${BASE_URL}/auth/logout`
  },
  SYSTEM: {
    ROLE: {
      INDEX: `${BASE_URL}/roles`
    },
    USER: {
      INDEX: `${BASE_URL}/users`
    }
  },
  SETTING: {
    CITY: {
      INDEX: `${BASE_URL}/city`
    },
    DELIVERY_TYPE: {
      INDEX: `${BASE_URL}/delivery-type`
    },
    PAYMENT_TYPE: {
      INDEX: `${BASE_URL}/payment-type`
    }
  },
  PERMISSION: {},
  PRODUCT: {},
  ORDER: {},
  REVIEW: {},
  PRODUCT_TYPE: {},
  REPORT: {}
}
