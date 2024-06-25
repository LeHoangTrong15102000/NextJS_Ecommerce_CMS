// Đường dẫn này chỉ có thể đọc thôi, đánh tránh trong quá trình code gõ sai
const path = {
  HOME: '/home',
  user: '/user',
  PRODUCT: '/product',
  PROFILE: '/my-profile',
  MY_CART: '/my-cart',
  CHANGE_PASSWORD: '/change-password',
  CHECKOUT_PRODUCT: '/checkout-product',
  MY_ORDER: '/my-order',
  historyPurchases: '/user/purchase',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  MY_PRODUCT: '/my-product',
  categories: '/categories',
  productDetail: ':nameId', // sửa lại thành nameId cho nó đồng bộ với logic productDetail, tuy không để dấu '/' nhưng nó vẫn hiểu là có dấu /
  cart: '/cart', // dường dẫn trên UI do chúng ta tự tạo ra để phù hợp

  SYSTEM: {
    ROLE: '/system/role',
    USER: '/system/user'
  },
  MANAGE_PRODUCT: {
    PRODUCT: '/manage-product/product',
    MANAGE_TYPE_PRODUCT: '/manage-product/product-type'
  },
  MANAGE_ORDER: {
    ORDER: '/manage-order/order',
    REVIEW: '/manage-order/review'
  },
  SETTING: {
    CITY: '/settings/city',
    DELIVERY_TYPE: '/settings/delivery-type',
    PAYMENT_TYPE: '/settings/payment-type'
  },
  DASHBOARD: '/dashboard'
} as const

export default path
