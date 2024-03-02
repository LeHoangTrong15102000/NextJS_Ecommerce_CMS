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
  MANAGE_SYSTEM: {
    SYSTEM: {
      ROLE: '/system/role',
      USER: '/system/user'
    },
    PRODUCT: {
      MANAGE_PRODUCT: '/product/manage-product',
      MANAGE_ORDER: '/product/manage-order',
      MANAGE_REVIEW: '/product/manage-review',
      MANAGE_TYPE_PRODUCT: '/product/manage-type-product'
    },
    SETTING: {
      CITY: '/settings/city',
      DELIVERY_TYPE: '/settings/delivery-type',
      PAYMENT_TYPE: '/settings/payment-type'
    }
  }
} as const

export default path
