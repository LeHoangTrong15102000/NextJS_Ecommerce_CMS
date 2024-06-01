import { useTranslation } from 'react-i18next'

export const STATUS_ORDER_PRODUCT = () => {
  const { t } = useTranslation()
  return {
    0: {
      label: t('Wait_payment'),
      value: '0'
    },
    1: {
      label: t('Wait_delivery'),
      value: '1'
    },
    2: {
      label: t('Done_order_product'),
      value: '2'
    },
    3: {
      label: t('Canceled_order_product'),
      value: '3'
    }
  }
}
