# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Quản trị người dùng

### Xây dựng UI cho trang quản trị người dùng

- Aiga Mizuki

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

- Khi mà trả về cái `getDetailUser` mà muốn trả về `password` thì chúng ta cần phải chỉnh lại ở trong phía BE nhưng mà nó sẽ trả về cho chúng ta một cái `password` đã được hash rồi

- Khi mà có idUser thì không cho hiển thị cái thằng password của chúng ta

### Integrate API edit người dùng

- Thực hiện Integrate API cập nhật người dùng

- Sẽ thực hiện Integrate API cập nhật người dùng tiếp tục

- Khi mà có user và role thì chúng ta mới đưa vào lưu trữ trong datababse mặc định không có thì không cần phải đưa vào database

- Khi mà muốn check lỗi thì chúng ta vào `userController` để mà check, check các lỗi liên quan đến server -> Khi mà có lỗi thì nó sẽ chạy vào Error của thằng `Controller` nên là chúng ta sẽ check được lỗi khi mà nó bị lỗi

- Cái list thông tin người dùng trả về đang có vấn đề chút nữa chúng ta sẽ trả thêm dữ liệu vào,

  - Thằng Avatar sẽ do state của react quản lí

- Còn một vấn đề nữa khi mà chúng ta update Avatar thành công ở trong myprofile thì cái thằng avatar tại userDropdown nó không có thay đổi -> Thì khi mà update thành công thì

  - Cái nguyên nhân của chúng ta là do nó lấy từ thằng user từ `useAuth` của chúng ta -> Nên là chúng ta cần `update` lại data của thằng user trong `useAuth` của chúng ta

  - Thì chúng ta cập nhật lại thằng `setUser` ở trong contextApi của chúng ta -> Chúng ta sẽ suy nghĩ cách tốt hơn để lưu thằng `user` -> Vì khi mà chúng ta update trên context thì thằng cha nó sẽ re-render lại tất cả những thằng con bên (không chỉ riêng mỗi thằng state của chúng ta) trong nó không giống như thằng redux

  - Nên là chúng ta dùng redux ở đây để cập nhật nó lại -> Khi mà đưa lên Redux thì nó sẽ đồng bộ dữ liệu ở trang `myprofile` và phần `user-dropdown` của chúng ta

### Integrate API xóa người dùng và xử lý đồng bộ tài khoản của tôi và user dropdown

- Thực hiện Integrate API xoá người dùng , phải tách cái fullName ra thành firstName lastName, middleName

- Thực hiện việc Integrate API delete người dùng và thực hiện cải thiện lại luồng của `my-profile` và `user-dropdown`

- Sẽ xử lý ở phần my-profile khi mà thông tin ở `my-profile` update thì ở thằng `user-dropdown` cũng sẽ `update` luôn -> Sẽ tạo ra một hàm UpdateAuthMeAsync bằng Redux của chúng ta

- Khi mà vào với thằng myprofile thì thằng `userData` call đến `avatar` trong user-dropdown nó sẽ không có vì chúng ta chưa có call Api gì cả -> Tại vì chúng ta chưa call đến API `updateUserAsync` nênn là thằng `userData` nó sẽ không có, thì chỗ này chúng ta cần xử lý dữ liệu như thế nào

  - Thì chỗ này chúng ta sẽ xử lý như thế này -> sử dụng useEffect và để `userData` vào dependency -> Thì khi đã có userData rồi thì lúc này, tức là lúc này nó đã call tới updateProfile của chúng ta rồi thì lúc này chúng ta sẽ thực hiện `setUser` lại trên `user-dropdown`

  - Ở đây chúng ta không sử dụng trực tiếp thằng redux mà khi nó thay đổi (thằng userData có đữ liệu vì chúng ta đã thực hiện updateAuthMeAsync) thì chúng ta sẽ set lại thằng user bên trong context thì lúc này user dropdown sẽ nhận lại được giá trị mới và cập nhật lại UI

  - Thì lúc đầu nó chỉ có call APi getAuthMe để set user bên trong context thôi nên khi mà updateMeAuthApi được thực hiện thì lúc này `userData(Redux store auth)` có rồi thì nó sẽ thay đổi lại `user` bên trong context

- Nên là ở đây chúng ta không thể sử dụngg context bên trog thz updateAuthMeAsync ở phần quản lý người dùng vì khi mà set như vậy thì thằng `context` component bên trong chưa kịp cập nhật thì thz cha đã re-render rồi dẫn đến UI vẫn `như cũ`

  - Thì lúc này chúng ta sẽ làm như thế này

### Custom Table Header cho xử lý actions multiple

- Sẽ thực hiện custom Table Header cho việc xử lý `actions multiple` -> Sẽ cùng nhau xử lý xoá multiple ở chỗ user này

- Sẽ xử lý `tableheader` UI cho chỗ này

- Sẽ dùng `onRowSelectionModelChange` => thì lúc này khi mà đã có được cái thằng `row` của từng thằng user rồi

  - Sẽ tạo ra một biến là `selectedRow` là một cái array, khi màm thằng Row thay đổi thì chúng ta sẽ set nó là thằng `row(vì thằng row này mặc đinh là một cái array)` như sau setSelectedRow(row)

  - Lúc này sẽ tạo ra một component là `table-header` để mà sử dụng ở nhiều nơi

  - Khi mà đã nhấn vào selectedRow rồi thì chúng ta sẽ ẩn đi nút `tạo` và thanh search

  - Thì thằng TableHeader sẽ nhận vào một cáii `actions`

  - Sau khi đã có được thằng button xoá `allSelectedRows` rồi thì tiếp theo chúng ta sẽ làm gì đây -> Khi mà onClick vào nút xáo thì chúng ta cần phải thực hiện một cái nữa, thì hàm `handlActionDelete thì sẽ nhận vàoo cái type: string` tức là cái value mà chúng ta khai báo ở trong thằng `actions`

  - Thì cái thằng action nó có nhiều thằng ở trong đây nên sử dụng `switch case` để mà xử lý

  - Quay lại vấn đề hồi nảy là khi chúng ta truyềnn vào cái array rỗng thì nó sẽ mất đi hết những thằng đã chọn ở `TableUser`

### Integrate xóa multiple danh sách người dùng

- Những thằng có vai trò là admin thì sẽ không cho xóa nó là như vậy

- selectedRow hiện tại chỉ là những cái id mà thôi nên không thể nào mà xử lý được -> Với cái id thì chúng ta sẽ lấy ra thông tin của thằng `user`

- Chúng ta cần phải kiếm được thằng row trả về đầy đủ thông tin người dùng khi mà nhấn vào -> Để những thằng người dùng nào có role là `ADMIN` thì chúng sẽ không được phép xoá, role `BASIC` và những role khác được quyền xoá khỏi danh sách người dùng

  - Ơ đây khi mà chúng ta chọn một thz nào đó thì chúng ta sẽ `config` lại cái thz đó của chúng ta như sau

  - Cái lúc này khi mà chúng ta set cái thằng selectedRow của chúng ta

  - Sẽ check điều kiện khi mà `disabled` cái button của chúng ta dựa vào cái `permissions` của thằng role -> Chỉ cần có một thằng nào đó gồm cái `permissions` `ADMIN` của chúng ta -> Thì mình sẽ `disabled` nó đi

- Sẽ xử lý việc xoá multiple ở đây -> Thực hiện việc gọi API để xoá multiple cho `users` trên system users

  - Việc đầu tiên sẽ làm là tạo ra actions và xử lý cái action đó

  - Sau khi mà nó nhấn vào cái button `Delete` thì chúng ta sẽ `dispatch` cái action đó -> Trước khi mà dispatch thì sẽ hiển thị ra thằng `confirmDialog` để xác nhận rằng người dùng có muốn xoá người dùng với số lượng lớn hay không

### Xử lý phân trang, search, sort danh sách người dùng

- Sẽ gộp RoleId, Status, CityId thành một state mới để mà filter

- Bây giờ mà khi thằng RoleSelected nó thay đổi thì chúng ta sẽ bắt cái sự kiện thay đổi của nó

- Filter theo nhiều nhóm vai trò cùng một lúc luôn -> Sẽ lọc ra danh sách theo 1 đến 2 nhóm vai trò

- Sẽ thực hiện improve multiple sCielect sau khi đã thực hiện được thằng city rồi

### Hoàn thành quản lí người dùng

## Quản lý cài đặt

### Khai báo service và slice cho cài đặt city

- Thực hiện UI và integrate API quản trị thành phố

### Hoàn thành settings thành phố

### Khai báo service và slice cho cài đặt phương thức giao hàng

### Hoàn thành quản trị phương thức giao hàng

### Hoàn thành quản trị phương thức thanh toán

### Refactor phần quản trị settings

- Đã có thằng constant payment type rồi thì lúc này sẽ xử lý để hiển thị ra cái `roleList` ở chỗ select

- Khi mà chúng ta chọn thì cái tên chúng ta có thể thay đổi nhưng `type` thì là để phân biệt giữa các phương thức thanh toán với nhau, Với cái type là mặc định nó chỉ gồm 3 thằng thôi và không thay đổi

### Apply list cities và xử lý filter multiple select

- Sẽ thực hiện filter ở cái thành phố ở đây nữa

- Lúc này khi mà filter bằng multiple select thì chúng ta cần phải truyền lên dấu gạch đứng như này `1|2` -> Thì lúc này chúng ta sẽ viết hàm utils để format lại những `filter` này

  - Nếu như là nó đưa thằng string vào thì chúng ta sẽ gửi thằng string lên serer

  - Còn nếu như là đưa vào một cái array các phần tử thì chúng ta cần phải convert từ cái array sang thành `string` và các phần tử trong array cách nhau bởi dấu gạch đứng `|` ví dụ như sau `string | string | string` như thế này

- Chuyển tất cả các user sang là chọn `multiple` hay vì là `single`

## Quản trị sản phẩm

### Hoàn thành quản trị loại sản phẩm

- thực hiện việc tạo loại sản phẩm

  - tạo ra slug để tối ưu SEO hơn

- Khi mà nhấn vào tên loại sản phẩm thì chúng ta cần tự động điện slug của nó, sẽ bỏ đi tất cả các dấu và thêm vào dấu `gạch ngang` như thế này `-`

- Thuộc tính `getValues` là chúng ta sẽ lấy tất cả các value trong cái form của chúng ta

- Chỗ s lug thì nó sẽ giống như là thằng onChange đều sẽ lấy vào `e.target.value` -> Sẽ thực hiện replace đi những dấu kí tự và khoản trắng sau đó sẽ thay thế bằng dấu gạch ngang

- Cải thiện lại slug ở phần tạo ra loại sản phẩm

### Xử lý slug của product type và refactor phân quyền của sản phẩm

- Thì ở trong chúng ta sẽ có get All product public và get detail product public

- Với những thằng public sẽ là sản phẩm ở trang HOME của người dùng, và những thằng không có chữ update thì nó sẽ giành cho những thằng có chữ CMS của mình

- Sẽ thêm 1 cái quyền view ở chỗ sản phẩm

- Thì ở CMS thì chúng ta phân quyền VIEW cho product còn sản phẩm ở trang HOME thì chúng ta sẽ không phân quyền cho nó

### Setup service và Redux cho quản trị sản phẩm

- Thực hiện setup cho phần quản trị sản phẩm của chúng ta

### Set cho quản trị sản phẩm và refactor error từ API

- Thực hiện set cho phần quản trị sản phẩm

- Ở cái description thì chúng ta sẽ sử dụng một cái editor để có thể thêm đoạn text vào những mô tả cho sản phẩm

### Xử lý UI cho popup tạo sản phẩm

- Sẽ lấy cái form trong quản lí người dùng cho việc quản lí sản phẩm của chúng ta

- Thực hiện tạo UI popup cho việc tạo sản phẩm

- Phía bên dưới discount sẽ là ngày bắt đầu giảm giá và ngày kết thúc giảm giá

### Tạo custom date pick component

- Thì lúc này bắt buộc chúng ta phải custom lại thằng date picker component vì lúc này nhìn nó rất là ghê

- Sẽ `custom` trực tiếp trên cái thẻ box của chúng ta nên là do đó nó vẫn nhìn lỡm như thế nào ấy

- Để mà click được vào cái cuốn lịch mà nó sẽ hiển thị lên cái popup của date thì chúng ta cần phải lấy được cái date của thằng `datepicker`

  - Thì khi mà đã có ref rồi thì lúc này khi mà nhấn vào cái icon thì chúng ta sẽ bắt sự kiện onClick vàoo cho nó

### Tạo custom component editor

- Thì tất cả những thằng này sẽ được lưu dưới dạng string và được lưu dưới database của chúng ta -> Sau đó sẽ lấy string từ database đưa lên và hiển thị dưới dạng HTML -> Thì đó chính là công dụng của thằng editor của chúng ta

  - Nên là chúng ta cần cho nó render ở phía client thì nó sẽ không bị vấn đề là `window` không được định nghĩa ở phía server nữa

  - Khi mà thêm thằng EditorState vào thì chúng ta sẽ không biết được là nó sẽ validate với thằng yup thì nó sẽ như thế nàoo

  - Trong EditorState là một cái `Block` chúnga ta cần covert sang kiểu là string thì nó mới hiểu được

### Xử lý validate ngày giảm giá trong tạo sản phẩm

- Sẽ bắt đầu xử lý validate cho ngày bắt đầu giảm giá và ngày kết thúc giảm giá

- Khi mà chúng ta nhập vào cái phần trăm giảm giá thì lúc này nó phải bắt đầu require `ngày bắt đầu giảm giá`, `ngày kết thúc giảm giá`

  - Thì lúc này liên quan đến `discountStartDate` thì lúc nầy chúng ta cần phải lấy được cái value của thằng `discount` để mà test

  - Sau khi đã lấy được discount và value của ngày bắt đầu rồi thì tiếp theo chúng ta sẽ -> Mặc dù là nó không `notRequired` nhưng mà sẽ return la false khi mà thằng discount có giá trị và thằng `value` của `discountStartDate` chưa có giá trị -> Thì lúc này sẽ có lỗi -> Và cái q uan trọng nữa là ngày bắt đầu thì phải lớn hơn ngày hiện tại -> Thì lúc này nó sẽ disabled tất cả những ngày hiện tại trở về trước

    - Khi mà nó disabled đi thì chúng ta cần phải style lại cho nó một tí để có thể phần biệt được

  - Thì ở chỗ ngày kết thúc phải lấy ra được cái value của ngày bắt đầu

  - Thì chỗ discount cũng phải xử lý validate cho ngày giảm giá luôn

### Xử lý CREATE, EDIT sản phẩm

- Thực hiện việc thêm xoá sửa sản phẩm trong phần quản lý sản phẩm này

- Sẽ thực hiện log thằng data khi mà tạo sản phẩm ở bên trong thằng quản lý sản phẩm xem là nó đang bị vấn đề gì -> Nếu mà chưa log ra được gì thằng chỗ thằng errors đang có lỗi xảy rồi -> Nên là chúng ta sẽ log chỗ thằng errors ra -> Có khả năng cao là nó bị lỗi ở component editor của chúng ta rồi

  - Hình ảnh sản phẩm sẽ không `require`

  - Thằng description chúng ta truyền xuống là dạng `EditorState` chứ không phải là dạng `string` nên là nó bị lỗi

  - Nên là chỗ này chúng ta sẽ xử lý như thế này khi mà chúng ta truyền data xuống server thì chúng ta cần convert lại thầng description của chúng ta

  - Chỗ xử lý hình ảnh của editorState sẽ xử lý giống như thằng `imageProduct`, nhưng mà sẽ để xử lý ở phía sau

  - Lúc mà editProduct thì chúng ta phải convert từ dang `HTML` ở phía server trả về sang dạng `draft-wysiwyg`

  - Sẽ tạo ra một cái function để convert từ `HTML` sang `draftjs`

### Hoàn thành quản trị sản phẩm

- Hoàn thiện việc quản trị sản phẩm

- Search sản phẩm là có search theo giá theo `type`

### Luồng thay đổi nhánh khác cất code nhánh mới voà rồi sau đos đẩy lên remote github

- Nếu đang code tại một nhánh này ví dụ như `feature/manage-role-system` nhưng mà code hiện tại của chúng ta đang code cho tính năng khác thì lúc này chúng ta sẽ thực hiện như sau

  - git stash -u

  - quay về nhánh main về pull code từ nhánh `feature/manage-role-system` lúc trước đẩy lên github

  - Sau đó tạo ra nhánh mới git checkot -b `feature/manage-user-system`

  - Rồi sau đó sẽ thực hiện git stash apply

  - Đẩy code mới lên nhánh vừa tạo là `feature/manage-user-system`
