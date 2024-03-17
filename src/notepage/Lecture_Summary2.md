# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Nhóm vai trò , xử lý phân quyền User

### Xử lý bảng phân quyền cho nhóm vai trò P1

- Sẽ xử lý thằng checkbox action và integrate vào API Role của chúng ta

- Và ở thằng `RoleList` khi mà update chính cái `name role` đó thì nó vẫn bình thường và không bị lỗi `RoleName` nữa

- Thì ở đây sẽ cùng nhau xử lý thằng checkbox của `RoleName` và integrate nó vào `API của Server`

  - Thì ở trong permission config thì chúng ta sẽ sửa đổi lại một chút thì chúng ta sẽ đổi lại là value và parentValue của nó

  - Còn với những hành động là gì thì chúng ta sẽ dựa vào cái cột thì mình sẽ lấy cái value đó -> Thì lúc này chúng ta sẽ không cần phải tạo ra các key như `create, update, delete` ở trong `config permission` nữa

  - Chúng ta sẽ không có check quyền về việc tạo một cái review -> Mà chỉ có những thằng nào đã mua sản phẩm của chúng ta thì mới có quyền tạo review

  - Để mà phân biệt được `parent` và `children` thì chúng ta sẽ dùng `textTransform`

  - Và sẽ chỉnh lại checkbox của thằng Role một tí xíu, khi mà nó nhấn vào checkbox của thằng nào thì tất cả các thằng con sẽ được check hết và ngược lại -> Và khi tất cả các action bên thằng con đều được check thì thằng con sẽ được check và ngược lại

  - Thì làm sao để mà lấy được value trong thằng `getView` này -> Thì trong row lúc nảy thì chúng ta đã thêm value là `PRODUCT` rồi

  - Nếu đang là thằng cha thì cái value sẽ là `undefined` -> `value: PERMISSIONS[row.parentValue]?.[row.value]['VIEW']` thì như thế này sẽ lấy được giá trị của từng cột `VIEW` `CREATE` `UPDATE` `DELETE` thì rất là đơn giản

  - Chúng ta cũng cần phải lấy được `value` từ cái thằng `parent` -> Nên là chúng ta cũng cần sẽ phải log ra để mà lấy được giá trị -> Khi mà click vào parent thì nó sẽ lấy tất cả value từ những thằng con, thì ở đây làm sao để lấy được tất cả những value của những thăng con -> Thì chúng ta sẽ cho nó có cái value là `MANAGE_PRODUCT` -> Thằng cha cũng phải có value để chúng ta biết nó đang là thằng nào

  - Thì lúc này đã có được value của thằng cha rồi thì làm sao để lấy được value của những thằng con -> Khi mà lấy được `MANAGE_PRODUCT` chúng ta đã có được object chứa các thằng con thì lúc này -> Sẽ dùng Object.values( objs) thì nó sẽ trả về một mảng chứa các object `value` của keys `PRODUCT` và `PRODUCT_TYPE` -> Thì xíu sẽ thực hiện cách lấy tất cả các value trong mảng đó sau

  - Tạm thời sẽ bỏ qua thằng cha để xử lý những thằng con trước -> Sau khi mà đã lấy được value của các thằng con rồi thì tiếp theo sẽ bắt sự kiện onChange của nó

  - Ở component RoleList sẽ tạo ra một state `permission` -> Sẽ tạo ra một state permission mà chúng ta đã check rồi

### Xử lý sự kiện group cho bảng phân quyền cho nhóm vai trò

### Hoàn thiện quản lý nhóm vai trò

### Xử lý phân quyền ở các trang trong hệ thống

### Xử lý phân quyền ở thanh menu

### Custom hook xử lý phân quyền

## Quản trị người dùng

### Xây dựng UI cho trang quản trị người dùng

### Xây dựng UI tạo, edit người dùng

### Integrate APi tạo người dùng

### Integrate API edit người dùng

### Integrate API xóa người dùng và xử lý đồng bộ tài khoản của tôi và user dropdown

### Custom Table Header cho xử lý actions multiple

### Integrate xóa multiple danh sách người dùng

### Xử lý phân trang, search, sort danh sách người dùng

### Hoàn thành quản lí người dùng

## Quản lý cài đặt

### Khai báo service và slice cho cài đặt city

### Hoàn thành settings thành phố

### Khai báo service và slice cho cài đặt phương thức giao hàng

### Hoàn thành quản trị phương thức giao hàng

### Hoàn thành quản trị phương thức thanh toán

### Refactor phần quản trị settings

### Apply list cities và xử lý filter multiple select
