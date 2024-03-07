# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Xây dựng phần bố cục cho quản trị hệ thống

### Dựng base cho phần Menu của trang quản trị hệ thống

- Thật ra trong thực tế nó sẽ không có trang `manageSystem` đâu -> Ở đây chúng ta cần phải hard code nó trước rồi xử lý sau

- Phần auth thì chúng ta sẽ không có quản lí, chúng ta chỉ quản lí phần `users` và `roles` , sẽ giúp chúng ta phân quyền cho từng nhóm vai trò -> Từng user sẽ ứng với một nhóm vai trò, nhưng user trong nhóm vai trò đó sẽ có quyền của nhóm vai trò đó

- `City` , `delivery-type`, `payment type` thì ba thằng này sẽ liên quan dến phần cài đặt của chúng ta

- Đầu tiên chúng ta sẽ cùng nhau xử lý phần `VerticalLayout` cho phần `system`

  - Trong phần hệ thống phải bao gồm `users` và `roles` của chúng ta

  - Loại của sản phẩm thì chúng ta sẽ đưa vào bên trong của `Quản trị sẩn phẩm` luôn

  - Nếu mà dài quá sẽ hiển thị thằng 3 chấm và đưa thz tooltip vào trong các cấu hình quản lí hệ thống của chúng ta -> làm vậy để nó không sinh ra thanh scroll ngang

    - Sẽ CSS như vậy cho nó nếu mà nó dài quá thì sẽ làm như sau
      - width: '100%'
      - display: 'block',
      - overflow: 'hidden'
      - text-overflow: 'ellipses'

- Ở phần sau sẽ xử lý rầng khi đang ở path của thằng nào thì phải vào path của thằng đó và thằng nào được `active` thì phải có màu chủ đạo của `theme` ở phần sau sẽ xử lý cả 2 thằng này

### Hoàn thiện UI cho thanh Menu

- Khi mà click vào `path` của thằng nào thì nó sẽ đá về trang của thằng đó -> Trước khi mà nó đá sang trang khác thì chúng ta muốn là nó active cái thằng đó lên và cả thằng cha của nó cũng `active` lên -> Thì chúng ta sẽ xử lý như thế này

  - Lúc này chúng ta sẽ tạo ra một state là `activePath`, có thể là chúng ta sẽ không truyền thằng `path` ở những cha nên thằng `state` này có thể là `null`

  - Khi mà `click` vào thằng Item thì chúng ta sẽ bắt sự kiện onClick cho nó -> Lúc này mình sẽ đá nó đến một cái function và truyền thằng path của mình vào

  - Có khả năng là cái thẻ của chúng ta nằm trong cấp con nhiều quá nên là nó không ăn được thuộc tính CSS
  - Khi mà click vào ListItemText thì chúng ta thấy phải đợi một tí -> Thì cái vấn đề một xíu sẽ bàn vẽ nó sau -> Thì cái vấn đền này nó không sao hết nên là cứ yên tâm

  - Đối với cái icon khi mà chúng ta active thì cũng cần phải đổi màu trắng cho nó luôn

  - Khi mà nó đang active và thằng cha đang mở thì cũng cho nó active luôn với điều kiện là `item.path === activePath || !!openItems[item.title]` -> Là cả thằng cha và thằng con đều sẽ `active` hết

  - Khi mà mở 2 cái path root cùng một lúc thì nó không có hợp lí -> Vì khi mà chúng ta click vào thì nó sẽ đá chúng ta đi -> Nên là chỗ này chúng ta sẽ xử lý

    - Thì khi mà click vào nó sẽ đá chúng ta đến trang người dùng -> Thì khi mà load lại trang người dùng -> Thì lúc này cái page manage-system của chúng ta sẽ `first render(re-render lại từ đầu)` lại kể cả thằng menu của chúng ta luôn -> Nên lúc này chúng ta chỉ biết được là thằng nào đã chọn trước đó mà thôi `(cái thằng path nào đang active dựa trên đường link URL)` -> Thì lúc này chúng ta sẽ dựa vào thằng `path` trên thanh `URL` để `activePath` chứ không thể sử dụng

    - Tóm lại trong một thời điểm chúng ta chỉ nên mở một thằng `Route System` cha thôi
    - Lúc này thằng active có thể sẽ không dựa vào cái state của chúng ta nữa mà sẽ dựa vào chính cái path trên thanh `URL` -> Và trong một thời điểm thì chúng ta chỉ được mở một thằng menu mà thôi -> Vậy thì trong cái setOpenItems chúng ta bỏ đi cái lấy lại tất cả giá trị ban đầu `...prev` đi là được

    - Khi mà active thì chúng ta sẽ cho important hết để không cho thằng nào nó ghi đè lại thuộc tính CSS của chúng ta

    - Tại sao lúc này tất cả các menu đều được active hết -> Đang check và fix bug -> Lúc này chúng ta sẽ log ra được là thằng nào đang là true và xem xét nguyên nhân gây ra lỗi của nó

      - Chúng ta sẽ log nó ra để debug -> `console.log(">>> Check is active menu", item.path === activePath, !!openItems[item.title])` -> Khi mà log ra như thế này thì chúng ta sẽ thấy được là

      - Khi mà chúng ta mở thằng cài đặt mà thằng hệ thống và quản trị sản phẩm nó đều active là do -> Cái `path` của nó khi mà chúng ta không chọn thì nó sẽ bị `bug` do thằng cha `menu` ngoài cùng không có `path` nên vì lí do nào đó mà tất cả các menu cha khi ban đầu đều bị active lên hết

        - Do là ban đầu là thằng `item.path` là `undefined` và thằng `activepath` là `""` nên là khi so sánh kiểu dữ liệu thì nó là bằng nhau nên nó chạy vào được cái điều kiện `item.path === activePath` nên là tất cả các `menu cha` đều bị `active` lúc ban đầu

    - Sẽ ngăn cách đường line chính giữa, giữa các icon để cho nó rõ hơn -> Sẽ tham khảo và style lại cho thằng này nó đẹp hơn

### Improve UI cho thanh Menu

- Cải thiện UI cho thanh menu

- Sẽ bắt đầu style lại cho thanh menu -> Sẽ dùng cái class của MUI là `.MuiButtonBase-root MuiListItemButton-root` -> Thì khi mà inspect ở ngoài browser thì chúng ta thấy dược rằng là 2 thầng clas này của MUI là custom được cho cái `MuiListItem` của chúng ta

- Đầu tiên sẽ bỏ thằng padding ở thẻ cha là `Nav` -> Và cho thằng `ListItemButton` thuộc tính là margin: '1px 0'

  - Thuộc tính backgroundColor nó sẽ không work đói với những thằng icon của chúng ta

  - Dùng hàm hexToRGBA để covert từ màu `Hex` sang `RGBA`

- Hiện tại thì cái thằng `MenuVertical` của chúng ta vẫn chưa ổn -> Để mà biết được là vấn đề đang chưa ổn chỗ nào thì chúng ta sẽ xây dựng cái base trước rồi sau đó sẽ giải quyết cái vấn đề đó

### Tạo Custom Modal cho dự án

- Thực hiện custom Modal cho dự án

- Hướng dẫn sử dụng sourcetree

- Custom Modal cho dự án của chúng ta sẽ thực hiện để tạo ra UI cho người dùng

  - Trong quá trình ma chúng ta đã bước qua cái `System` của chúng ta thì chúng ta sẽ có những cái `Modal` để mà tạo -> Sẽ tiến hành custom những cái `Modal` ở đây

  - Những thằng children hay open mặc định đã có ở trong props của thằng `ModalProps` rồi nên là khai báo nữa là nó sẽ bị lỗi

  - Thì cái việc `backgroundColor` của content bên ngoài của cái Modal của chúng ta màu gì -> Thì cái đó bên ngoài sẽ quyết định -> Sẽ do `children` của chúng ta quyết định -> backgroundColor này không cần chỉnh mặc định trong thằng Modal của chúng ta đâu

  - Với cái thằng width thì thằng children bên ngoài nó sẽ quyết định luôn

  - Nhưng mà với việc là những cái content children của chúng ta là nó phải nằm chính giữa -> Thì cái việc đó trong Modal phải quyết định điều đó.

  - Trong Modal mà cho nó hiện thanh scroll thì có cảm giác nó rất là chặt trọi -> Nên là `overflow`, 'scroll' hay không sẽ để cho thằng `Modal` quyết định - Mình chỉ cần đưa `width` với thằng `height` cho nó thôi

  - Cái scroll của chúng ta bị mất phần đầu nên là -> Chúng ta sẽ bọc thêm 1 thẻ `Box` ở bên ngoài và thêm thuộc tính `maxHeight` vào - mục đích chính là thu nhỏ cái content bên trong Modal lại

  - Chúng ta muốn có khoảng cách giữa top và bottom của thằng `content-Modal`

### Tạo custom data grid

- Thực hiện custom data grid cho dự án

- Sẽ Style lại cho thằng `Data Grid`, cái thứ nhất là thằng `border`

- Khi mà cho border thì thằng `border-top-right` và `border-top-left` nó không work thằng `borderRadius` là do trong project của chúng ta đã ghi đè lại thằng `borderRadius` ở class của thư viện rồi có thể là các class như này `.MuiTableContainer-root, & .MuiDataGrid-root, & .MuiDataGrid-columnHeaders`

- Tạm thời chúng ta sẽ giữ nguyên hết tất cả nhưng thứ này -> Ở phần sau chúng ta sẽ xử lý

- Sau này mà chúng ta muốn lấy được những cái `ref` mà truyền từ thằng cha truyền xuống thằng con -> Thì nó sẽ có một thằng là forwardRef

- Thì ở trong customDataGrid sẽ nhận thêm một cái ref nữa -> Thì ở đây chúng ta không biết ref là cái gì, thì ref ở đây như là ref truyền từ thằng cha xuống thằng con để lấy cái table của chúng ta -> Và nó sẽ có kiểu là `ref: Ref<any>` tạm thời cái type chúng ta không biết là gì thì để là `any`

- Thì khi mà dùng chỉ cần truyền data `column` vào trong props `DataGrid` là được -> Khi nào mà cần dùng thì chỉ cần truyền gridData vào là được

## Nhóm vai trò, xử lý phân quyền cho user

### Xử lý layout ở hệ thống và integrate API cơ bản cho nhóm vai trò

- Thường thường trong dự án sẽ xử lý phân quyền trước rồi mới xây dựng những tính năng sau

- Tạo RoleList compenent hiểu dơn giản là sẽ có một cái List chứa những cái Role bên trong và cái bảng Permission bên phía tay phải của chúng ta

- Về những thứ như Xử lý Role sẽ làm trong phần `CustomModal` component của chúng ta

  - Khi mà để CSS của thằng của thằng container trong `layoutnotApp` do chúng ta chưa trừ `width` của thằng `Drawer` nên là nó sinh ră thanh `scroll` ngang

  - Lúc này cái content ở giữa của thằng Role sẽ phải trừ đi `240px` của drawer khi là true và là 4.5rem khi là false

- Bây giờ chúng ta sẽ tạo ra thằng `Table` của chúng ta

  - Sẽ có 2 bản là `List role` và `List permission`

- Có thể truyền params như thế này `data: {params: TParams}` và cùng thể truyền vào như thế này `params: TParams -> 'API_ENDPOINT, { params }'`

  - Thường xử lý getAllRoles thì thường sẽ không có lỗi nên không cần phải check điệu kiện `response.data` có không rồi mới trả về `response` -> Ở trong `RoleSlice` sẽ xử lý những thằng lỗi không trả về response

### Xây dựng UI cho trang quản lý nhóm vai trò

- Thực hiện xây dựng UI cho trang quản lí nhóm vai trò -> Thì ở lần trước chúng ta đã truyền vào page=-1 và limit=-1 để lấy tất cả những thằng `role` trong `database` của chúng ta ra

- Khi mà đã có data và total rồi thì chúng ta sẽ đi render ra giao diện -> Và sau đó phân quyền cho dự án

  - Lên thư viện MUI xem cách nó sử dụng grid-x-mui như thế nào rồi chúng ta sẽ dùng thằng `custom-grid-data` để mình sử dụng thằng data chỗ này

  - Sẽ có 2 cái table , cái bên trái sẽ là `table` để chúng ta `CRUD roles` con table bên phải sẽ là nơi chúng ta `checkbox(permission)` để chúng ta chọn role.

  - Lúc này không thể `{ roles }` bên trong thằng TableRoles được vì sau khi click vào `TableRoles` thì chúng ta phải lấy thông tin thằng `Roles` đó và hiển thị xuống dưới `PermissionRoles(column right)` -> Như vậy thì không thể nào sử dụng `TableRoles` được -> Nên là chúng ta sẽ move cái logic vào bên trong file `RoleList` lại

  - Ở trong thằng roles do `redux` trả về hiện tại chỉ có hiện thị thằng name

  - Thằng slots bên trong CustomDataGrid có thể nhận vào một `pagination` -> Và `pagination` sẽ nhận vào một `component` nhưng nó sẽ không nhận trực tiếp component vào mà nó sẽ nhận qua một `function` -> Thì để thằng pagination nó nhận được cái component của chúng ta -> Không thể nào viết như vậy được `<CustomPagination />` thì nó sẽ bị lỗi, nên là chúng ta sẽ viết dưới dạng là tên `hàm`

  - Sẽ tạo một cái Options cho `pageSizeOptions` của chúng ta

  - Ở chỗ `RoleList` không cho nó tính năng xoá thậm chi là thằng phân trang cũng không nên có -> Nhưng mà thôi sẽ để luôn để sau này bưng qua các thằng component sẽ dễ hơn không cần phải đi custom lại nữa

  - Và những thằng `Sort` thì nó cũng đã work rồi nhưng chúng ta lại muốn dùng thằng sort ở chế độ `server`

  - Đã có `field: name` rồi cần có `field: action` nữa để xoá sửa role của chúng ta

  - Thêm thanh search và dấu `+` để tạo `Role` trên đầu của `TableRole`

    - Tạo ra component `Edit` và `Delete` tại vì 2 cái ButtonIcon sẽ được sử dụng rất là nhiều nơi

    - Sau này khi mà phân quyền vào thì nó sẽ có disable đi sợ ra cái style của nó sẽ không ổn lắm

    - Và tạo ra một thằng `button` tạo nữa

    - Tạo ra component input sẻarch luôn để tái sử dụng ở các page khác

### Integrate API tạo nhóm vai trò

### Hoàn thành integrate API CRUD cho nhóm vai trò

### Tích hợp search, order list với grid data cho nhóm vai trò

### Custom confirmation dialog component

### Improve cho dự án

### Xử lý thông báo của API với type error từ API

### Xây dựng UI cho bản phân quyền

### Giải thích về luồng phân quyền ở API

### Xử lý bảng phân quyền cho nhóm vai trò P1

### Xử lý sự kiện group cho bảng phân quyền cho nhóm vai trò

### Hoàn thiện quản lý nhóm vai trò

### Xử lý phân quyền ở các trang trong hệ thống

### Xử lý phân quyền ở thanh menu

### Custom hook xử lý phân quyền
