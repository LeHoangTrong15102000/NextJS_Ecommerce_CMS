export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001/api'

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`,
    LOGOUT: `${BASE_URL}/auth/logout`
  }
}
