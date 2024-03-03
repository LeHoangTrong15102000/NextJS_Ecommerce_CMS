import path from './path'

export const VerticalItems = [
  {
    title: 'Hệ thống',
    icon: 'eos-icons:system-group',
    childrens: [
      {
        title: 'Người dùng',
        icon: 'iconoir:group',
        path: path.MANAGE_SYSTEM.SYSTEM.USER
      },
      {
        title: 'Nhóm vai trò',
        icon: 'icon-park-outline:permissions',
        path: path.MANAGE_SYSTEM.SYSTEM.ROLE
      }
    ]
  },
  {
    title: 'Quản trị sản phẩm',
    icon: 'eos-icons:products-outlined',
    childrens: [
      {
        title: 'Danh sách sản phẩm',
        icon: 'icon-park-outline:ad-product',
        path: path.MANAGE_SYSTEM.PRODUCT.MANAGE_PRODUCT
      },
      {
        title: 'Danh mục sản phẩm',
        icon: 'material-symbols:category-outline',
        path: path.MANAGE_SYSTEM.PRODUCT.MANAGE_TYPE_PRODUCT
      },
      {
        title: 'Danh sách đơn hàng',
        icon: 'lets-icons:order',
        path: path.MANAGE_SYSTEM.PRODUCT.MANAGE_ORDER
      },
      {
        title: 'Danh sách đánh giá',
        icon: 'carbon:review',
        path: path.MANAGE_SYSTEM.PRODUCT.MANAGE_REVIEW
      }
    ]
  },
  {
    title: 'Cài đặt',
    icon: 'ant-design:setting-outlined',
    childrens: [
      {
        title: 'Thành phố',
        icon: 'solar:city-linear',
        path: path.MANAGE_SYSTEM.SETTING.CITY
      },
      {
        title: 'Phương thức giao hàng',
        icon: 'carbon:delivery',
        path: path.MANAGE_SYSTEM.SETTING.DELIVERY_TYPE
      },
      {
        title: 'Phương thức thanh toán',
        icon: 'material-symbols:payments-outline',
        path: path.MANAGE_SYSTEM.SETTING.PAYMENT_TYPE
      }
    ]
  }
]
