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
  cart: '/cart' // dường dẫn trên UI do chúng ta tự tạo ra để phù hợp
} as const

export default path
