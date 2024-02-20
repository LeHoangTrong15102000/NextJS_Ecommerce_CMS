//  ** React
import { Fragment, useState } from 'react'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Next
import { NextPage } from 'next'

// ** MUI
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'

// ** Layout
import { VerticalItems } from 'src/configs/layout'

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {}

const RecursiveListItem = ({ items, level }: { items: any; level: number }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const handleClick = (title: string) => {
    setOpenItems((prev) => ({
      // prev là object cũ cũng có giá trị là [key: string]: boolean
      ...prev,
      [title]: !prev[title] // Sẽ trả về biến này là true hay false
    }))
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * 10}px`
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <CustomIcon icon={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item?.title} />
              {item.childrens && item.childrens.length > 0 && (
                //  Phải check như vậy thì mới đúng
                <>
                  {openItems[item.title] ? (
                    <CustomIcon icon='ic:sharp-expand-less' />
                  ) : (
                    <CustomIcon icon='ic:sharp-expand-more' />
                  )}
                </>
              )}
            </ListItemButton>
            {item.childrens && item.childrens.length > 0 && (
              <>
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  {/* <List component='div' disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <CustomIcon icon={child.icon} />
                            </ListItemIcon>
                            <ListItemText primary={child.title} />
                          </ListItemButton>
                        </List> */}
                  <RecursiveListItem items={item.childrens} level={level + 1} />
                </Collapse>
              </>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.
const ListVerticalLayout: NextPage<TProps> = () => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItem items={VerticalItems} level={1} />
      {/* <ListItemButton onClick={handleClick}>
        <ListItemIcon></ListItemIcon>
        <ListItemText primary='Inbox' />
        {openState ? <CustomIcon icon='ic:sharp-expand-less' /> : <CustomIcon icon='ic:round-expand-more' />}
      </ListItemButton> */}
    </List>
  )
}

export default ListVerticalLayout
