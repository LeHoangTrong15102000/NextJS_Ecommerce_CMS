import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

// Chuyển sang cách import không có server side rendering nữa ->  Chỉ dùng ở client mà thôi
const ReactDraftWysiwyg = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false
})

export default ReactDraftWysiwyg
