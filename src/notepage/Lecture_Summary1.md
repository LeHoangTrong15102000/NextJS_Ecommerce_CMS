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

### Improve UI cho thanh Menu

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
