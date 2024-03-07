import { Box, Modal, ModalProps, styled } from '@mui/material'
import React from 'react'

interface TCustomModal extends ModalProps {
  onClose: () => void
}

const StyleModal = styled(Modal)<ModalProps>(({ theme, children }) => ({
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const CustomModal = (props: TCustomModal) => {
  const { open, children, onClose } = props
  return (
    <StyleModal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {/* Box này là nó sẽ hiển thị thanh scroll của chúng ta */}
      <Box
        sx={{
          height: '100%', // lấy theo chiều cao của thằng StyleModal
          width: '100vw'
        }}
      >
        {/* Ghi đè lại maxHeight: 100vh để chó nó hiện ra thanh scroll */}
        <Box
          sx={{
            maxHeight: '100vh', // phải để nó hiện 100% viewport, thanh scroll mới có thể hoạt động được
            overflow: 'auto'
          }}
        >
          {/* height width 100% là cho cái content của chúng ta luôn dài hết không có thu nhỏ lại thì từ đó mới có thể scroll được */}
          {/* Nó luôn luôn bọc cho cái content của chúng ta dài xuống và không có thu nhỏ lại - để có thể scroll được content trong Modal */}
          <Box
            sx={{
              height: '100%',
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Do dưới đây nó có margin nên là không căn giữa được và chỉ work được khi cái thằng maxHeigh: 100% thôi */}
            {/* Do Box này chúng ta căn theo content nên không cho maxHeight vào được */}
            <Box
              sx={{
                margin: '40px 0'
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyleModal>
  )
}

export default CustomModal
