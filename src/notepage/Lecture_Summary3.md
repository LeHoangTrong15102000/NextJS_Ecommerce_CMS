# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Quản trị người dùng

### Xây dựng UI cho trang quản trị người dùng

- Thực hiện xây dựng UI cho quản trị người dùng của chúng ta

- Thì lúc này ở trong cái RoleList chúng ta đã biết được user có những cái quyền gì rồi -> Thì lúc này chúng ta sẽ xử lý chỗ phân quyền này

- Ở trong cái UserList này chỉ có một cái Table để mà chúng ta quản lí mà thôi

- pageSize mặc định sẽ là thằng `pageSizeOptions[0]` -> Lấy tất cả các `userList` từ API xem nó trả về dữ liệu gì cho chúng ta

  - Thì khi call userList thì nó sẽ trả về cho chúng ta danh sách người dùng

  - Hiện tại thì ở đây chỉ có email và nh óm vai trò của chúng ta mà thôi, nhưng mà trong thực tế thì nó sẽ có nhiều hơn nữa, tại ở đây chúng ta chưa update những thông tin của thằng user, nên ở đây chúng ta sẽ tạm thời xử lý những thông tin hiện có như vậy

  - Do ẩn cái hideFooter nên là nó không hiển thị ra cái `footer Pagination` -> Tạm thời sẽ tạo ra cái khung sườn cho thằng quản lí người dùng

  - Thì cái thằng typography tượng chưng cho những thằng `Title` của chúng ta -> Nên là muốn sửa lại CSS của nó thì chúng ta custom lại CSS của nó

### Xây dựng UI tạo, edit người dùng

- Xây dựng UI tạo và edit cho người dùng -> Thực hiện việc tạo UI

- Sẽ là vào `userService` để mà xem lúc mà tạo user thì nó sẽ có những thứ gì ở đó -> Từ đó chúng ta mới thực hiện vào trong code của chúng ta -> Cũng cần phải truyền cho nó một cái password nữa

  - Thằng id cũng sẽ là string luôn vì nó chỉ chứa cái `id` trong thằng user của chúng ta mà thôi

  - Các dự liệu ở bên trong thì tất cả sẽ là string hết, city thì sẽ chứa `id` của thằng city đó

  - Tại vì với cái lúc mà chúng update thì đối với thằng ADMIN thì không cần required đối với thông tin của ADMIN, còn việc tạo những user khác thì cần phải required

  - Ở trong hàm onSubmit thì chúng ta cần tạo ra cái type `defaultValues` cho những data mà chúng ta sẽ submit lên trên server

  - Tạm thời thì nó sẽ là như vậy sẽ còn đợt improve UI cho ứng dụng nữa

  - Sử dụng Box để nó loại bỏ đi thằng Grid của chúng ta -> Sau đó thì chúng ta sẽ sử dụng lại thằng `Grid` bên trong thằng `Box`

  - Ở đây chúng ta chưa biết giá trị của value onChange onBlur ở trong thằng Switch là gì thì chúng ta sẽ log nó ra và coi xử lý nó

  - Với để là checked thì nó sẽ đúng hơn -> Thì với thằng checked thì chúng ta sẽ xử lý như thế nào -> thì cái thằng `value` nó sẽ chỉ là 1 và 0 thì ở đây là nó sẽ đồng nghĩa với true và false

  - Sẽ để lại là khi mà nó checked thì sẽ là 1 còn không sẽ là 0

  - Tạo thêm một cái trường là password cho nó, xíu nữa là chúng ta sẽ set lại cái height và width tại cái bảng thông tin là number fullName và phoneNumber city

  - Tại vì cái `password` nó khá là quan trọng nên là chúng ta sẽ đưa nó nằm xuống dưới cái email

  - Trong cái API thì mặc định user là 1 rồi nên là không cần status vào làm gì nữa

  - Ở đây chúng ta sẽ không có fullName mà là firstName lastName và middleName -> Thì thằng fullName chỉ required ở trên UI mà thôi
  - Vậy đã xử lý xong cái thằng UI người dùng và đã submit được và lấy được dữ l iệu người dùng rồi

  - Chỉnh lại create và update user rồi thực hiện ghép Api vào hoàn thành CRUD user

### Integrate API tạo người dùng

- Thực hiện Integrate API tạo người dùng

- Khi mà call create user API thành công thì chúng ta sẽ thực hiện tiếp các bước

- Chúng ta sẽ xử lý một chút chỗ `TableUser`

- Sau khi đã tạo thành công nhưng mà thằng `sort` theo created thì nó vẫn chưa đúng

- Khi mà Edit thì chúng ta cần phải ẩn đi cái chỗ password thì nó mới hợp lý

### Integrate API edit người dùng

- Thực hiện Integrate API cập nhật người dùng

### Integrate API xóa người dùng và xử lý đồng bộ tài khoản của tôi và user dropdown

- Thực hiện Integrate API xoá người dùng , phải tách cái fullName ra thành firstName lastName, middleName

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

## Quản trị sản phẩm

### Hoàn thành quản trị loại sản phẩm

### Xử lý slug của product type và refactor phân quyền của sản phẩm

### Setup service và Redux cho quản trị sản phẩm

### Set cho quản trị sản phẩm và refactor error từ API

### Xử lý UI cho popup tạo sản phẩm

### Tạo custom date pick component

### Tạo custom component editor

### Xử lý validate ngày giảm giá trong tạo sản phẩm

### Xử lý CREATE, EDIT sản phẩm

### Hoàn thành quản trị sản phẩm
