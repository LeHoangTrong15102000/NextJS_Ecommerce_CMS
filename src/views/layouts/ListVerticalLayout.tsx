//  ** React
import { Fragment, useState } from 'react'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Next
import { NextPage } from 'next'

// ** MUI
import { Box, BoxProps, styled } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import { VerticalItems } from 'src/configs/layout'

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {}

// TODO remove, this demo shouldn't need to reset the theme.
const ListVerticalLayout: NextPage<TProps> = () => {
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      {VerticalItems?.map((item) => {
        return (
          <Fragment key={item.title}>
            <ListItemButton
              onClick={() => {
                if (item.childrens) {
                  handleClick()
                }
              }}
            >
              <ListItemIcon>
                <CustomIcon icon={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item?.title} />
              {item.childrens && open ? (
                <CustomIcon icon='ic:sharp-expand-less' />
              ) : (
                <CustomIcon icon='ic:round-expand-more' />
              )}
            </ListItemButton>
            {item.childrens && item.childrens.length > 0 && (
              <>
                {item.childrens.map((child) => {
                  return (
                    <Fragment key={child.title}>
                      <Collapse in={open} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <CustomIcon icon={child.icon} />
                            </ListItemIcon>
                            <ListItemText primary={child.title} />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </Fragment>
                  )
                })}
              </>
            )}
          </Fragment>
        )
      })}

      {/* <ListItemButton onClick={handleClick}>
        <ListItemIcon></ListItemIcon>
        <ListItemText primary='Inbox' />
        {openState ? <CustomIcon icon='ic:sharp-expand-less' /> : <CustomIcon icon='ic:round-expand-more' />}
      </ListItemButton> */}
    </List>
  )
}

export default ListVerticalLayout
