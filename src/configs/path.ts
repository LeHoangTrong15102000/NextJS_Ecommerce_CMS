// Đường dẫn này chỉ có thể đọc thôi, đánh tránh trong quá trình code gõ sai
const path = {
  HOME: '/',
  user: '/user',
  PROFILE: '/my-profile',
  CHANGE_PASSWORD: '/change-password',
  historyPurchases: '/user/purchase',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  categories: '/categories',
  productDetail: ':nameId', // sửa lại thành nameId cho nó đồng bộ với logic productDetail, tuy không để dấu '/' nhưng nó vẫn hiểu là có dấu /
  cart: '/cart', // dường dẫn trên UI do chúng ta tự tạo ra để phù hợp

  SYSTEM: {
    ROLE: '/system/role',
    USER: '/system/user'
  },
  MANAGE_PRODUCT: {
    PRODUCT: '/manage-product/products',
    MANAGE_ORDER: '/manage-product/orders',
    MANAGE_REVIEW: '/manage-product/reviews',
    MANAGE_TYPE_PRODUCT: '/manage-product/type-products'
  },
  SETTING: {
    CITY: '/settings/city',
    DELIVERY_TYPE: '/settings/delivery-type',
    PAYMENT_TYPE: '/settings/payment-type'
  },
  DASHBOARD: '/dashboard'
} as const

export default path
