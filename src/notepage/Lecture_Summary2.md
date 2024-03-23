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

  - Ở component RoleList sẽ tạo ra một state `permission` -> Sẽ tạo ra một state permission mà chúng ta đã check rồi -> Khi mà đã ăn sự kiện onChange rồi thì bây giờ chúng ta sẽ xử lý thằng này như thế nào

  - Tiếp theo chúng ta sẽ check thêm thì cái value nó đã nằm trong permissionSelected của chúng ta hay chưa -> Thì nếu như mà nó nằm trong `permissionSelected` có nghĩa là chúng ta đã checkbox rồi

    - Thì đầu tiên trong cái hàm chúng ta phải tạo ra một biến `isChecked` -> Khi mà đã check rồi thì khi mà nhấn vào thì chúng ta sẽ bỏ cái thz đó ra khỏi `permissionSelected` cũng đồng nghĩa cái checkbox ở UI cũng không còn trạng thái `checked` -> Sau đó thì set lại vào `setPermissionSelected` này là được.

    - Hiện tại thì cái thằng checked của chúng ta nó vẫn cưa có work đâu nên là chúng ta cần phải xử lý thêm -> Thì khi mà chúng ta click vào từng `RoleName` thì phải hiển thị ra `permissionTable` -> Nên hiện tại là cái `permissionTable` của chúng ta không biết là của `RoleName` nào cả nên là chúng ta cần phải bắt cái sự kiện ở đây -> Mục đích click vào `RoleName` là để lấy cái `id` của thằng `RoleName`

    - Thì khi mà click vào thằng nào thì nó phải thay đổi theo cái `RoleName` -> Nên là chúng ta sẽ tạo ra một cái state là `selectedRow` -> Khi mà click vào RoleName nào đó thì chúng ta sẽ set cái `row.id` vào `selectedRow` -> Còn cái button để update `PermissionTable` thì chúng ta sẽ xử lý sau

    - Chúng ta sẽ dùng `useEffect` để thực hiện việc này -> Thì khi mà có `selectedRow` thì chúng ta sẽ call `DetailPermission` của RoleName đó

    - Và cái nhiệm vụ của chúng ta bây giờ là tạo ra `fetchAPI` `getDetailPermissionRole` -> Và sẽ thực hiện `fetchDetailsRole` ở RoleList và lấy ra các giá trị bên trong Array Permission và `checked` tương ứng lên `TablePermission`

    - Và điều nữa là khi mà selectedRow không có thì chúng ta không hiển thị TablePermission ra làm gì

    - Sẽ truyền handleRolePermission xuống TablePermission để khi mà nhấn vào button thì sẽ thực hiện gọi API

    - Trong thực tế thì thằng admin của chúng ta nó phải `checked all` hết tất cả `checkbox`

    - Ở lần sau sẽ xử lý khi mà nhấn vào `checkbox group` thì tất cả các `checkbox` con nó sẽ được check hết

### Xử lý sự kiện group cho bảng phân quyền cho nhóm vai trò

- Thực hiện checkAll cho `TablePermission` -> Khi mà checkAll thì tất cả `checkbox` bên trong sẽ được `checked`

- Khi mà click vào `selectedRow` thì chúng ta cần phải active nó lên để biết rằng là thằng nào đang được active đến.

  - Sẽ chỉnh lại `background` khi mà chúng ta hover vào

- Thì ở đây chúng ta sẽ xử lý RoleName trước

  - Thì mặc định thằng AdminRole sẽ d checkAll hết tất cả các action và sẽ được disabled và không thể nào thay đổi được ->

  - Và cái BasicRole cũng vậy thì các checkbox sẽ được checked và không thể nào thay đổi được

  - Đâu tiên sẽ viết một cái hàm -> Khi mà đưa cái `key` vào thì sẽ lấy tất cả các thằng value bên trong `Config Permission` -> Thì input đầu vào là một cái object và kiểu dữ liệu là gì cũng được nên là chúng ta sẽ để là any -> Dùng try-catch để tránh trường hợp mà nó truyền vào cái array thì nó sẽ bị lỗi

    - Ví dụ khi mà chúng ta truyền key `MANAGE_PRODUCT` thì chúng ta sẽ lấy tất cả các value trong thằng `MANAGE_PRODUCT` như `PRODUCT`, `PRODUCT_TYPE`

    - Thì output trả về là một cái `Array`

  - Dùng vòng lặp for in để lấy ra những cái key trong cái Obj mà mình truyền vào

    - Ví dụ chúng ta dùng for in để lặp qua thằng `MANAGE_PRODUCT` thì key trong obj đó là `PRODUCT` và `PRODUCT_TYPE`

    - Và chúng ta sẽ dùng `MANAGE_PRODUCT.PRODUCT` thì chúng ta sẽ gọi thêm một lần đệ quy nữa

    - Sẽ kiểm tra nếu `obj[key] === 'object'` -> Nếu là obj thì chúng ta sẽ call lại thằng hàm này để lấy lại tất cả các obj bên trong cấp con luôn

    - Còn ngược lại nếu các value của key không phải là một object mà nó là một string thì chỉ cần push vào là được

  - Chắc chắn là cái hàm `getAllValueOfObject` sẽ còn sử dụng lại rất là nhiều

  - Ở đây sẽ có vài trường hợp, ví dụ nếu muốn lấy tất cả các giá tri thằng `MANAGE_PRODUCT` -> Với lại là 2 thằng `ADMIN.GRANTED` vá `BASIC.PUBLIC` nó không có nằm trong cái `TablePermission` của chúng ta thì phải làm như thế nào -> Thì ở trong cái function `getAllValueOfObject` chúng ta sẽ s thêm một params nữa là `arrExclude` để loại bỏ thằng `ADMIN` và thằng `BASIC` ra

  - Rồi thì chỗ này chúng ta sẽ xử lý như thế nào cho nó tố ưu bây giờ -> Khi mà click vào thằng `detailRowRole`

  - Thì nếu nó bao gồm Role `Admin` và `Basic` -> Sẽ kiểm tra nếu res?.data.permission có tồn tại 1 trong 2 thằng là `ADMIN` và `BASIC` thì nếu như nó là `defaultPermission` thì chúng ta sẽ

    - Còn không thì chúng ta sẽ setPermissionSelected như bình thường theo cái `permissions` của nó

  - Ở đây chúng ta phân tách nó ra, cái thứ nhất là chúng ta sẽ thêm vào cái `DASHBOARD` chứa những cái chart về những số liệu của cửa hàng

  - Cũng phải đưa thằng Dashboard vào `configPermissions` ở trên server luôn

  - Đối với thằng BASIC thì chỉ có thể được view DashBoard mà thôi, còn ADMIN của chúng ta sẽ được full quyền luôn -> Nên là ở đây chúng ta sẽ xử lý như thế này

    - Nên là ở phần getDetailsRole sẽ xử lý -> Nếu nó là `RoleBasic` thì chúng ta sẽ xử lý khác, nếu là `RoleAdmin` thì sẽ xử lý khác

    - Nếu nó là `basicRole` thì chỉ cho phép xem dashboard và không được phép chỉnh sửa ở trong trang `AdminDashboard`

  - Nên là khi mà hàm `getValuePermission` khi mà không nhận vào `parentValue` -> Nên là những thằng mà optional mà không yêu cầu `required` thì chúng ta sẽ để phía cuối -> Nên là thz nào có parentValue thì truyền vào còn không thì thôi

- Bây giờ sẽ xử lý đền phần `checkboxAll` -> Khi mà `checkboxAll` `checked` thì tất cả những thằng con bên trong đều sẽ `checked` -> Sẽ phải xử lý từng tí từng tí một

  - Khi mà chúng ta click vào thằng parent thì phải dựa vào cái key là `isParent` là `true` và dựa vào cái key nữa là `MANAGE_PRODUCT` để chúng ta lấy hết tất cả giá trị bên trong ví dụ như `MANAGE_PRODUCT.PRODUCT.CREATE` và sau đó chúng ta sẽ check xem là nó (những thằng con checkbox bên trong) đã `checkAll` hết hay là chưa

  - Nếu như mà nó đã checkAll hết rồi thì thằng parentCheckbox nó sẽ được checked và khi nhấn vào lần nữa thì nó sẽ `huỷ` `checkAll` của tất cả các thằng con

  - Còn đối với những thằng `isParent` là `false` -> Thì chúng ta sẽ lấy `PERMISSIONS`.`parentValue`.`value` sau đó lấy tất cả các giá trị bên trong cái object đó để mà `checke` tương tự như là với thằng `isParent là true`

  - Thì cái `value={row.value}` chúng ta sẽ giữ nguyên còn ở cái sự kiện `onChange` chúng ta sẽ chia ra thành 2 loại là `isParent` là `true` và `isParent` là `false` -> Thì ở đây chúng ta cần chia ra thêm 2 hàm nữa

  - Chúng ta sẽ gọi các thằng trong cùng một nhóm là một cái `group`, còn thằng `isParent là false` thì chúng ta sẽ gọi và xử lý `checkAllChildren`

    - Thì cái hàm `handleCheckAllCheckbox` nó sẽ nhận vào cái gì

    - Thì cái isParent là false chúng ta có được `value` và `parentValue` thì thằng `value` ở trong thằng row nó chính là thằng `e.target.value`

    - Thì hàm `handleCheckAllCheckbox` phải truyền thêm `row.parentValue` và `e.target.value`

    - Thì đối với những thằng không có `parentValue` thì mình chỉ lấy cái `value` mà thôi -> Cho nên là ở đây thì nó sẽ có 2 trường hợp là chúng ta sẽ truyền `e.target.value` trước rồi mới truyền `row.parentValue` -> Vì thằng `parentValue` có thể là `optional channing` như là thằng `DASHBOARD`

    - Khi mà check như thế này thì chúng ta sẽ xử lý như thế nào -> Khi mà `checkAll` vào thằng ví dụ như `PRODUCT` `PRODUCT_TYPE` thì chúng ta sẽ lấy tất cả các `value` của thằng đó

    - Sau khi mà đã có được allValue rồi thì chúng ta sẽ check xem là tất cả các thằng vừa `checkAll` đã nằm trong state là `permissionSelected` hay chưa

      - Nếu nó nằm tất cả trong thằng này rồi thì tất cả đã được `checkAll` rồi

      - Nếu mà `isCheckedAll` là true thì tất cả những thằng này nó đã `check` hết rồi thì khi chúng ta click vào checkbox `checkAll` thì chúng ta phải bỏ đi trạng thái `checked` của những thằng con bên trong

      - Nên khi mà nhấn vào `checkboxAll` một lần nữa chúng ta cần phải `filter` đi tất cả các giá trị bên trong thằng `allValue`

    - Còn trường hợp `isCheckAll` là `false` thì cần phải xử lý như thế nào -> Nghĩa là những thằng con chưa `checked` hết -> Thì chúng ta sẽ rãi lại những thằng cũ, và `checked` đối với những thằng chưa được `checked` -> Nên là lúc này tất cả những thằng con nằm bên trong đều sẽ được `checked` và chúng ta sẽ `setPermissionSelected` lại

    - Hiện tại thi cái chức năng `checkboxAll` nó vẫn chưa hoạt động hiệu quả -> Tí nữa chúng ta sẽ fix nó sau

      - Và fix cái vấn đề checkbox này ở đây

    - Sau khi đã thực hiện checkboxAll cho `isParent` là `false` rồi tiếp theo sẽ thực hiện checkboxAll cho `isParent` là `true`

    - Tiếp tục thực hiện việc `CheckboxGroup`

      - Chúng ta muốn là khi mà click vào 2 thằng con của isParent là false thì cái `checkBox` tổng của 2 thằng đó nó phải được check lên thì giờ sẽ cần phải xử lý nó như thế nào

      - Thì ở chỗ row `field` là `all` chúng ta sẽ xử lý và check tại đây, thì làm sao lúc này chúng ta biết được `checkboxAll` đã được `checked` hay chưa

      - Sẽ viết một hàm kiểm tra xem đã `checkedAll` hay chưa

      - Khi mà cái thằng cuối trong cái row đó được checked rồi thì thằng `permissionSelected` nó sẽ được chạy lại và nó sẽ render lại cái `column` và thằng handleIsChecked nó sẽ chạy lại lần nữa để check xem là tất cả các thằng con bên trong nó đã được checked hay chưa nếu đã checked rồi thì thầng `checkboxAll` sẽ được `checked`

    - Sau khi đã kiểm tra `checkAll` ở `isParent` là `false` rồi thì chúng ta sẽ kiểm tra tiếp theo ở thằng `isParent` là `true`

      - Thì bây giờ `checkboxAll` thằng `Group isParent` là `true` thì chúng ta sẽ xử lý như thế nào -> Thì chúng ta sẽ tạo ra hàm `handleCheckAllGroupCheckbox()` để mà xử lý vấn đề này

      - Thì ở cái thằng `CheckAllGroup` thì nó chỉ có `isParent` là true và `value` chính là `parentValue` của các thằng con -> Nên là chúng ta chỉ cần đưa thằng `e.target.value` vào thôi không cần phải đưa thằng `parentValue` -> Nên tách ra từng hàm như vậy thì nó sẽ dễ dàng kiểm soát hơn

    - Thực hiện `checkAllGroupCheckbox` giống như là `checkAllCheckbox`

    - Khi mà nhấn vào checkALlGroupCheckbox thì thằng checked nó sẽ được `check` thì lúc này thằng component TablePermission nó sẽ chạy lại thì lúc này thằng hàm `handleIsChecked` nó sẽ chạy lại

    - Ở đây có cái vấn đề đó là khi mà `Checked` vào thằng `checkAllGroupCheckbox` thì nó sẽ lấy lại tất cả các giá trị trong cái `checkBoxGroup` đó vô tình làm trùng giá trị -> Nên là ở đây chúng ta cần phải xử lý nó -> Nên là cần phải `fix` cái vấn đề chỗ này -> Cần phải fix chỗ này thì sau này đi làm mới có thể `fix bug` được -> vấn đề là nó bị duplicate lên với những `checkbox` đã check rồi ở bên trong thằng `GroupCheckbox`

      - Vậy là cái vấn đề lỗi ở đây là do khi mà checkbox ở `checkboxAll` và `CheckallGroup` thì nó sẽ thêm tất cả dữ liệu ở mỗi thằng `row` của một cái `groupbox` vào bên trong state `permissionSelected` mặc dù bên trong thằng `permissionSelected` có thể đã có giá trị đó rồi

      - Vậy trước khi mà thêm vào thằng `permissionSelected` chúng ta cần phải check xem là thằng `permissionSelected` đã có giá trị đó hay chưa -> Nếu có giá trị đó rồi thì chúng ta không thêm nó vào nữa, còn nếu là chưa có thì sẽ thêm nó vào

      - Về phần lỗi của duplicate dữ liệu thì chúng ta có thể sử dụng thằng `(...new Set([]))` để mà set lại giá trị của thằng -> Chúng ta cũng có thể tạo ra một biến `unique` bằng cách sử dụng `new Set()`

      - Và thêm vấn đề nữa là thằng DASHBOARD nó cũng đang bị lỗi -> Sẽ tìm cách để mà xử lý chỗ `DASHBOARD` này thì mới được -> Khi mà click vào thằng `checkboxAll` DASHBOARD thì nó lại list ra value `DASHBOARD` của chúng ta thành các kí tự riêng biệt

        - Như vậy ở chỗ `DASHBOARD` này chúng ta phải xử lý như là những thằng dữ liệu ở bên dưới rồi là phải có `parentValue` để mà xử lý

        - Như vậy để mà xử lý chỗ này chúng ta cần phải thực hiện như sau -> Thì DashBoard sẽ phải làm lại giống như những như `Product` `System`

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
