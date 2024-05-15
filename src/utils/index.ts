import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { TItemOrderProduct, TItemOrderProductOfMe } from 'src/types/order-product'

export const handleToFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  }
  return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
}

export const convertFileToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separationFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }

  const arrFullName = fullName.trim().split(' ')?.filter(Boolean)
  if (arrFullName?.length === 1) {
    if (language === 'vi') {
      result.firstName = arrFullName.join()
    } else if (language === 'en') {
      result.lastName = arrFullName.join()
    }
  } else if (arrFullName.length === 2) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.firstName = arrFullName[1]
    } else if (language === 'en') {
      result.lastName = arrFullName[1]
      result.firstName = arrFullName[0]
    }
  } else if (arrFullName.length >= 3) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.firstName = arrFullName[arrFullName.length - 1]
    } else if (language === 'en') {
      result.firstName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.lastName = arrFullName[arrFullName.length - 1]
    }
  }

  return result
}

export const getAllValueOfObject = (obj: any, arrExclude?: string[]) => {
  try {
    const values: any[] = []
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        values.push(...getAllValueOfObject(obj[key], arrExclude))
      } else {
        // Nếu không phải là obj[key] nằm trong arrExclude thì chúng ta sẽ push vào values
        if (!arrExclude?.includes(obj[key])) {
          values.push(obj[key])
        }
      }
    }

    return values
  } catch (error) {
    return []
  }
}

// Format date trong phần tạo quản lý phương thức giao hàng
export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return

  return new Intl.DateTimeFormat('vi-VN', formatting).format(new Date(value))
}

// Convert multiple selection và những thằng như là roleId, status
export const formatFilter = (filter: any) => {
  const result: Record<string, string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key]?.length > 0) {
      result[key] = filter[key].join('|')
    } else if (filter[key]) {
      result[key] = filter[key]
    }
  })

  return result
}

//
export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}

// Function convert HTML to draftjs
export const convertHTMLToDraftjs = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  const editorState = EditorState.createWithContent(contentState)

  return editorState
}

// Function Convert price product
export const formatNumberToLocale = (value: string | number) => {
  try {
    return Number(value).toLocaleString('vi-VN', {
      minimumFractionDigits: 0 // đảm bảo rằng không có chứa số thập phân phía sau
    })
  } catch (error) {
    // Khi mà bị lỗi thì return về chính cái value luôn
    return value
  }
}

export const cloneDeep = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return data
  }
}

// Handle add product to cart
export const convertUpdateProductToCart = (orderItems: TItemOrderProduct[], addItem: TItemOrderProduct) => {
  try {
    let result = [] //
    const cloneOrderItems = cloneDeep(orderItems)
    // Product ở đây chính là dạng `ID`
    const findItem = cloneOrderItems.find((item: TItemOrderProduct) => item.product === addItem.product)
    // Nếu như mà nó đã  tồn tại thằng sản phẩm rồi
    if (findItem) {
      findItem.amount += addItem.amount
    } else {
      cloneOrderItems.push(addItem)
    }

    // Những thằng có số lượng thì giữ lại, những thằng k có thì xoá đi luôn
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)

    return result
  } catch (error) {
    return orderItems
  }
}

// handle add multiple product to cart
export const convertUpdateMultipleProductsCart = (orderItems: TItemOrderProduct[], addItems: TItemOrderProduct[]) => {
  try {
    let result = []
    const cloneOrderItems = cloneDeep(orderItems)

    // sẽ lập qua như thế này
    addItems.forEach((addItem) => {
      // Product ở đây chính là dạng `ID`
      const findItem = cloneOrderItems.find((item: TItemOrderProduct) => item.product === addItem.product)
      // Nếu như mà nó đã  tồn tại thằng sản phẩm rồi
      if (findItem) {
        findItem.amount += addItem.amount
      } else {
        cloneOrderItems.push(addItem)
      }
    })
    // Những thằng có số lượng thì giữ lại, những thằng k có thì xoá đi luôn
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)

    return result
  } catch (error) {
    return orderItems
  }
}

// Check valid  discount date
export const isExpireDiscountDate = (startDate: Date | null, endDate: Date | null) => {
  if (startDate && endDate) {
    const currentTime = new Date().getTime() // sẽ lấy ra dưới dạng là timestamp
    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()

    // Phải thoả điều kiện như này thì nó mới còn hạn cho discount
    return startDateTime <= currentTime && endDateTime > currentTime
  }

  return false
}
