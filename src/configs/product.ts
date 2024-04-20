import { useTranslation } from 'react-i18next'

// Thực hiện ở trong đây thôi
export const OBJECT_STATUS_PRODUCT = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Private'),
      value: '0'
    },
    '1': {
      label: t('Public'),
      value: '1'
    }
  }
}
