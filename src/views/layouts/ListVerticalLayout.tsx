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
import { Box, Tooltip, styled, useTheme } from '@mui/material'

// ** Layout
import { VerticalItems } from 'src/configs/layout'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

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
    // Trên dây thằng color phải !important cho nó thì nó mới work, còn các thầng khác thì không cần !important
    color: active ? `${theme.palette.primary.main} !important` : `rgba(${theme.palette.customColors.main}, 0.78)`,
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

  //
  const router = useRouter()

  // ** Xử lý khi click vào từng button title
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems((prev) => ({
        // prev là object cũ cũng có giá trị là [key: string]: boolean
        // Trước khi click thì prev là một cái object rỗng nên prev[title] là false
        [title]: !prev[title] // Sẽ trả về biến này là true hay false
      }))
    }
  }

  // Xử lý active path
  const handleSelectItem = (path: string) => {
    setActivePath(path)
    if (path) {
      router.push(path)
    }
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                margin: '1px 0',
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title]
                    ? `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
                    : theme.palette.background.paper
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
                handleSelectItem(item?.path)
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    backgroundColor:
                      (activePath && item.path === activePath) || !!openItems[item.title]
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    height: '30px',
                    width: '30px'
                  }}
                >
                  <CustomIcon
                    style={{
                      color:
                        (activePath && item.path === activePath) || !!openItems[item.title]
                          ? theme.palette.customColors.lightPaperBg
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                    }}
                    icon={item.icon}
                  />
                </Box>
              </ListItemIcon>
              {!disabled && (
                <Tooltip title={item?.title}>
                  <StyleListItemText
                    active={Boolean((activePath && item.path === activePath) || !!openItems[item.title])}
                    // onClick={() => handleSelectItem(item?.path)}
                    primary={item?.title}
                  />
                </Tooltip>
              )}
              {item.childrens && item.childrens.length > 0 && (
                //  Phải check như vậy thì mới đúng
                <>
                  {openItems[item.title] ? (
                    <CustomIcon
                      style={{
                        color:
                          (activePath && item.path === activePath) || !!openItems[item.title]
                            ? theme.palette.primary.main
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon='ic:sharp-expand-less'
                    />
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

  const listVerticalItems = VerticalItems()

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItem
        disabled={!open}
        items={listVerticalItems}
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
