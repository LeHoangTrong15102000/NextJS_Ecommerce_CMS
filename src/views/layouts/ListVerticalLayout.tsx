//  ** React
import { Fragment, useEffect, useState } from 'react'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Next
import { NextPage } from 'next'

// ** MUI
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import { Tooltip, styled, useTheme } from '@mui/material'

// ** Layout
import { VerticalItems } from 'src/configs/layout'

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {
  open: boolean
}

type TListItems = {
  level: number
  openItems: {
    [key: string]: boolean
  }
  items: any
  setOpenItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  disabled: boolean
  activePath: string | null
  setActivePath: React.Dispatch<React.SetStateAction<string | null>>
}

interface TListItemText extends ListItemTextProps {
  active: boolean
}

// custom lại ListItemText để cho nó hiện ra tooltip khi mà  text quá dài

const StyleListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    color: active ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main}, 0.78)`,
    fontWeight: active ? 600 : 400
  }
}))

const RecursiveListItem: NextPage<TListItems> = ({
  items,
  level,
  openItems,
  setOpenItems,
  disabled,
  activePath,
  setActivePath
}) => {
  // ** Theme
  const theme = useTheme()

  // ** Xử lý khi click vào từng button title
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems((prev) => ({
        // prev là object cũ cũng có giá trị là [key: string]: boolean
        ...prev,
        [title]: !prev[title] // Sẽ trả về biến này là true hay false
      }))
    }
  }

  // Xử lý active path
  const handleSelectItem = (path: string) => {
    setActivePath(path)
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                backgroundColor:
                  item.path === activePath
                    ? `rgba(${theme.palette.customColors.dark}, 0.7) !important`
                    : theme.palette.background.paper
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <CustomIcon
                  style={{
                    backgroundColor:
                      item.path === activePath ? theme.palette.primary.main : theme.palette.background.paper,
                    color:
                      item.path === activePath
                        ? theme.palette.customColors.lightPaperBg
                        : `rgba(${theme.palette.customColors.main}, 0.78)`
                  }}
                  icon={item.icon}
                />
              </ListItemIcon>
              {!disabled && (
                <Tooltip title={item?.title}>
                  <StyleListItemText
                    active={Boolean(item.path === activePath)}
                    onClick={() => handleSelectItem(item?.path)}
                    primary={item?.title}
                  />
                </Tooltip>
              )}
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
            {/* Render ra những thằng con trong đây */}
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
                  <RecursiveListItem
                    items={item.childrens}
                    level={level + 1}
                    openItems={openItems}
                    setOpenItems={setOpenItems}
                    disabled={disabled}
                    activePath={activePath}
                    setActivePath={setActivePath}
                  />
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
const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = useState<string | null>('')

  useEffect(() => {
    if (!open) {
      handleToggleAll()
    }
  }, [open])

  const handleToggleAll = () => {
    setOpenItems({})
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItem
        disabled={!open}
        items={VerticalItems}
        level={1}
        openItems={openItems}
        setOpenItems={setOpenItems}
        activePath={activePath}
        setActivePath={setActivePath}
      />
      {/* <ListItemButton onClick={handleClick}>
        <ListItemIcon></ListItemIcon>
        <ListItemText primary='Inbox' />
        {openState ? <CustomIcon icon='ic:sharp-expand-less' /> : <CustomIcon icon='ic:round-expand-more' />}
      </ListItemButton> */}
    </List>
  )
}

export default ListVerticalLayout
