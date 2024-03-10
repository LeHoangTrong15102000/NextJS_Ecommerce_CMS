// ** Translate
import { useTranslation } from 'react-i18next'

// ** Path
import path from './path'

export const VerticalItems = () => {
  const { t } = useTranslation()
  return [
    {
      title: t('System'),
      icon: 'eos-icons:system-group',
      childrens: [
        {
          title: t('User'),
          icon: 'iconoir:group',
          path: path.SYSTEM.USER
        },
        {
          title: t('Role'),
          icon: 'icon-park-outline:permissions',
          path: path.SYSTEM.ROLE
        }
      ]
    },
    {
      title: t('Manage_product'),
      icon: 'eos-icons:products-outlined',
      childrens: [
        {
          title: t('List_product'),
          icon: 'icon-park-outline:ad-product',
          path: path.MANAGE_PRODUCT.PRODUCT
        },
        {
          title: t('Type_product'),
          icon: 'material-symbols:category-outline',
          path: path.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        },
        {
          title: t('List_order'),
          icon: 'lets-icons:order',
          path: path.MANAGE_PRODUCT.MANAGE_ORDER
        },
        {
          title: t('List_review'),
          icon: 'carbon:review',
          path: path.MANAGE_PRODUCT.MANAGE_REVIEW
        }
      ]
    },
    {
      title: t('Setting'),
      icon: 'ant-design:setting-outlined',
      childrens: [
        {
          title: t('City'),
          icon: 'solar:city-linear',
          path: path.SETTING.CITY
        },
        {
          title: t('Delivery_method'),
          icon: 'carbon:delivery',
          path: path.SETTING.DELIVERY_TYPE
        },
        {
          title: t('Payment_method'),
          icon: 'material-symbols:payments-outline',
          path: path.SETTING.PAYMENT_TYPE
        }
      ]
    }
  ]
}
