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

- Hiện tại thì cái thằng `MenuVertical` của chúng ta vẫn chưa ổn

### Tạo Custom Modal cho dự án

### Tạo custom data grid

## Nhóm vai trò, xử lý phân quyền cho user

### Xử lý layout ở hệ thống và integrate API cơ bản cho nhóm vai trò

### Xây dựng UI cho trang quản lý nhóm vai trò

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
