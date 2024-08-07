// bảng phân quyền ở trên system CMS và cả hệ thống
export const PERMISSIONS: any = {
  ADMIN: 'ADMIN.GRANTED',
  BASIC: 'BASIC.PUBLIC',
  DASHBOARD: 'DASHBOARD',
  MANAGE_PRODUCT: {
    PRODUCT: {
      VIEW: 'MANAGE_PRODUCT.PRODUCT.VIEW',
      CREATE: 'MANAGE_PRODUCT.PRODUCT.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT.DELETE'
    },
    PRODUCT_TYPE: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT_TYPE.DELETE'
      //  Loại sản phẩm  thì không cần phải phân quyền thằng view cho nó làm gì
    }
  },
  SYSTEM: {
    USER: {
      VIEW: 'SYSTEM.USER.VIEW',
      CREATE: 'SYSTEM.USER.CREATE',
      UPDATE: 'SYSTEM.USER.UPDATE',
      DELETE: 'SYSTEM.USER.DELETE'
    },
    ROLE: {
      VIEW: 'SYSTEM.ROLE.VIEW',
      CREATE: 'SYSTEM.ROLE.CREATE',
      UPDATE: 'SYSTEM.ROLE.UPDATE',
      DELETE: 'SYSTEM.ROLE.DELETE'
    }
  },
  MANAGE_ORDER: {
    REVIEW: {
      UPDATE: 'MANAGE_ORDER.REVIEW.UPDATE',
      DELETE: 'MANAGE_ORDER.REVIEW.DELETE'
    },
    ORDER: {
      VIEW: 'MANAGE_ORDER.ORDER.VIEW',
      CREATE: 'MANAGE_ORDER.ORDER.CREATE',
      UPDATE: 'MANAGE_ORDER.ORDER.UPDATE',
      DELETE: 'MANAGE_ORDER.ORDER.DELETE'
    }
  },
  SETTING: {
    PAYMENT_TYPE: {
      // Không phân quyền đối với phương thức thanh toán
      CREATE: 'SETTING.PAYMENT_TYPE.CREATE',
      UPDATE: 'SETTING.PAYMENT_TYPE.UPDATE',
      DELETE: 'SETTING.PAYMENT_TYPE.DELETE'
    },
    DELIVERY_TYPE: {
      // Không phân quyền đối với phương thức giao hàng
      CREATE: 'SETTING.DELIVERY_TYPE.CREATE',
      UPDATE: 'SETTING.DELIVERY_TYPE.UPDATE',
      DELETE: 'SETTING.DELIVERY_TYPE.DELETE'
    },
    CITY: {
      // Không phân quyền đối với thành phố
      CREATE: 'SETTING.CITY.CREATE',
      UPDATE: 'SETTING.CITY.UPDATE',
      DELETE: 'SETTING.CITY.DELETE'
    }
  }
}

// LIST_DATA_PERMISSION dùng để phân quyền cho checkbox role ở user admin
// Row data permission - hard code một tí
export const LIST_DATA_PERMISSIONS: any = [
  // {
  //   id: 14,
  //   name: 'Chart',
  //   isParent: true,
  //   value: 'CHART'
  // },
  {
    id: 15,
    name: 'Dashboard',
    isParent: false,
    value: 'DASHBOARD',
    isHideCreate: true,
    isHideUpdate: true,
    isHideDelete: true,
    isHideAll: true
  },
  {
    id: 1,
    name: 'Manage_product',
    // isParent true có thể hiểu được là có phải là thằng con hay cha hay không
    isParent: true,
    value: 'MANAGE_PRODUCT'
  },
  {
    id: 2,
    name: 'Product',
    isParent: false,
    value: 'PRODUCT',
    parentValue: 'MANAGE_PRODUCT'
    // create: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.CREATE,
    // update: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.UPDATE,
    // delete: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.DELETE,
    // isHideView: true
  },
  {
    id: 3,
    name: 'Product_type',
    // isParent là false có nghĩa là thằng này là thằng con
    isParent: false,
    value: 'PRODUCT_TYPE',
    parentValue: 'MANAGE_PRODUCT',
    // view: PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW
    isHideView: true
  },
  {
    id: 4,
    name: 'System',
    isParent: true,
    value: 'SYSTEM'
  },
  {
    id: 5,
    name: 'User',
    isParent: false,
    value: 'USER',
    parentValue: 'SYSTEM'
  },
  {
    id: 6,
    name: 'Role',
    isParent: false,
    value: 'ROLE',
    parentValue: 'SYSTEM'
  },
  {
    id: 7,
    name: 'Manage_order',
    isParent: true,
    value: 'MANAGE_ORDER'
  },
  {
    id: 8,
    name: 'Review',
    isParent: false,
    value: 'REVIEW',
    parentValue: 'MANAGE_ORDER',

    // view và create người dùng có thể thao tác được
    isHideView: true,
    isHideCreate: true
  },
  {
    id: 9,
    name: 'Order',
    isParent: false,
    value: 'ORDER',
    parentValue: 'MANAGE_ORDER'
  },
  {
    id: 10,
    name: 'Setting',
    isParent: true,
    value: 'SETTING'
  },
  {
    id: 11,
    name: 'Payment_type',
    isParent: false,
    value: 'PAYMENT_TYPE',
    parentValue: 'SETTING',
    // view và create người dùng có thể thao tác được
    isHideView: true
  },
  {
    id: 12,
    name: 'Delivery_type',
    isParent: false,
    value: 'DELIVERY_TYPE',
    parentValue: 'SETTING',
    isHideView: true
  },
  {
    id: 13,
    name: 'City',
    isParent: false,
    value: 'CITY',
    parentValue: 'SETTING',
    isHideView: true
  }
]
