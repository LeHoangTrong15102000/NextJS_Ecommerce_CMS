//  ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

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
import { TVerticalItem, VerticalItems } from 'src/configs/layout'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

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

// Render component theo đệ quy
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

  // Hàm kiểm tra xem có phải thằng cha có thằng con đang active hay không
  // Xử lý active parent khi mà child active, dùng đệ quy để xử lý active giữa thằn cha và thằng con
  const isParentHaveChildActive = (item: TVerticalItem): boolean => {
    // Nếu như không có childrens
    if (!item.childrens) {
      return item.path === activePath
    }
    // Nếu như có childrens
    return item.childrens.some((item: TVerticalItem) => isParentHaveChildActive(item))
  }

  return (
    <>
      {items?.map((item: any) => {
        // console.log('Checkkk item vertical', { item })
        // Khi mà thằng con active thì thằng cha cũng sẽ active
        const isParentActive = isParentHaveChildActive(item)
        return (
          <Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                margin: '1px 0',
                backgroundColor:
                  // Trả về true hoặc false của item.title nào vừa được click
                  (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    ? `${hexToRGBA(theme.palette.primary.main, 0.2)} !important`
                    : theme.palette.background.paper
                // display: !item?.childrens?.length && !item.path ? 'none' : 'flex'
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
                // Phải có item.path thì mới cho thực hiện hàm handleSelectItem -> Nếu không thì nó sẽ trả về undefined
                if (item.path) {
                  handleSelectItem(item?.path)
                }
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    backgroundColor:
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
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
                        (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
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
                    active={Boolean(
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    )}
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
                          (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                            ? theme.palette.primary.main
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon='ic:sharp-expand-less'
                    />
                  ) : (
                    <CustomIcon
                      icon='ic:sharp-expand-more'
                      style={{
                        color: isParentActive
                          ? theme.palette.primary.main
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                    />
                  )}
                </>
              )}
            </ListItemButton>

            {/* Render ra những thằng con trong đây */}
            {/* Nếu như mà thằng children mà có thì nó sẽ dệ quy một lần và nó sẽ nhảy vào RecursiveListItem và render ra component con */}
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
  // ** State
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = useState<string | null>('')

  // Context Api
  const { user } = useAuth()

  // ** PermissionUser
  const permissionUser = user?.role?.permissions
    ? user?.role?.permissions?.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : user?.role?.permissions
    : []

  // const permissionUser = ['SYSTEM.ROLE.VIEW', 'SYSTEM.USER.VIEW', 'DASHBOARD']

  // ** Router
  const router = useRouter()

  // ** VerticalItems
  const listVerticalItems = VerticalItems()

  // Hàm tìm thằng cha có thằng con đang activePath
  const findParentActivePath = (items: TVerticalItem[], activePath: string) => {
    console.log('Checkk item', { items, activePath })
    for (const item of items) {
      if (item.path === activePath) {
        return item.title
      }
      if (item.childrens && item.childrens.length > 0) {
        const child = findParentActivePath(item.childrens, activePath)
        if (child) {
          return item.title
        }
      }
    }
    return null
  }

  // Hàm xử lý xem người dùng có quyền thao tác hay không
  // Kiểm tra  xem permission trong ListVerticalItem có nằm trong permissionUser của chúng ta  hay không
  const hasPermission = (item: any, permissionUser: string[]) => {
    return permissionUser.includes(item.permission) || !item.permission
  }

  // Hàm xử lý menu vertical theo permission
  const formatMenuVerticalByPermission = (menu: any[], permissionUser: string[]) => {
    if (menu) {
      return menu.filter((item) => {
        if (hasPermission(item, permissionUser)) {
          if (item.childrens && item.childrens.length > 0) {
            item.childrens = formatMenuVerticalByPermission(item.childrens, permissionUser)
          }
          // Thì đối với những thằng mà không có childrens và path thì sẽ return về false, còn thằng DASHBOARD là simple  nên là chúng ta vẫn render nó ra
          if (!item?.childrens?.length && !item.path) {
            return false
          }
          return true
        }
        return false
      })
    }
    return []
  }

  useEffect(() => {
    if (!open) {
      handleToggleAll()
    }
  }, [open])

  const handleToggleAll = () => {
    setOpenItems({})
  }

  // Menu have been formated List VerticalItems
  // Dùng useMemo(dùng caching 1 biến) để caching một cái function(thì function cũng là một biến)
  const formatedListVerticalItems = useMemo(() => {
    if (permissionUser.includes(PERMISSIONS.ADMIN)) {
      return listVerticalItems
    }
    return formatMenuVerticalByPermission(listVerticalItems, permissionUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVerticalItems, permissionUser])

  // useEffect để mà xử lý openItem khi mà từ thằng khác back về router đang đứng của chúng ta
  useEffect(() => {
    if (router.asPath) {
      const parentTitle = findParentActivePath(formatedListVerticalItems, router.asPath)
      // parentTitle có thể là null nên là có điều kiện để nó không bị lỗi
      if (parentTitle) {
        setOpenItems({
          [parentTitle]: true
        })
      }
      setActivePath(router.asPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItem
        disabled={!open}
        items={formatedListVerticalItems}
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
