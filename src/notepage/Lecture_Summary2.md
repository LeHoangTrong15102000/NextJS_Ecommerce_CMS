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

        - Sẽ cho `isParent` là false và `value` là `DASHBOARD`

        - Do ở đây là `isParent` là `false` nên là chúng ta sẽ gặp lỗi trong quá trình này nữa

        - Chúng ta sẽ giữ nguyên như củ và xử lý nó -> Và sẽ check xem vì saoo mà nó lại bị List ra thành từng chữ cái khi mà nó lặp qua vòng lặp `for in`

        - Do khi mà chúng ta thao tác với thằng DashBoard thì chúng ta truyền vào là một cái `string` chứ không phải là một `object` nên là nó -> Nên là chúng ta sẽ để một cái key vào thằng `id` Dashboard để dễ dàng nhận biết

        - Nên là khi mà row.isNoChild thì nó sẽ gặp lỗi vì không có `parentValue` và nó sẽ list chữ `DASHBOARD` của chúng ta ra thành từng chữ

        - Bây giờ sẽ có một cách rất là nhanh gọn lẹ mà không cần phải check điều kiện gì cả -> Sẽ thêm một thuộc tính khác vào là `isHideAll` để mà xử lý cái vấn đền này -> Này có thể coi là cách nhanh nhất để mà xử lý cái vấn đề này rồi

      - Sẽ xử lý lại cái phần mà nó bị duplicate dữ liệu

        - Trước khi mà setPermissionSelected thì chúng ta sẽ xoá đi tất cả dữ liệu ở trong một cái `GroupCheckbox` đó rồi thêm `allValue` vào là được

        - Có thể dùng `[...new Set([])]` -> Để mà những dữ liệu bị trùng lập thì nó sẽ bỏ đi cho chúng ta

        - Đã fix được vấn đề duplicate dữ liệu khi ma chúng ta `checkboxGroup` `permissions`

### Hoàn thiện quản lý nhóm vai trò

- Sẽ xử dụng `permission` của thằng `Role` để mà chúng ta phân quyền -> Tiếp tục xử lý phân quyền nhóm vai trò

- Chúng ta sẽ ẩn nút cập nhật ở role `Admin` và `Basic` vì hai role này chúng ta không cho phép cập nhật nó sẽ là cố định và không bao giờ thay đổi được

- Lúc này làm sao chúng ta có thể đưa `PermissionSelected` xuống phía dưới component `TablePermisson` -> tại vì lúc này chúng ta đã format lại `permissions` của những thằng `Admin` và `Basic` rồi -> Do đã format lại permissions của thằng Admin và Basic nên là chúng ta không lấy được

- Nên là ở đây chúng ta phải tạo ra một cái biến rồi truyền xuống rồi -> Vì 2 thằng `Admin` và `Basic` chúng ta đã format nó rồi nên không truyền xuống được nữa

- Lúc mở cái model lên thì phải reset lại thằng selectedRow lại -> Ở đây sẽ không cần reset lại vì nếu reset thì nó sẽ mất luôn cái bảng `TablePermission` của chúng ta

- Với lại là khi mà nhấn vào thì nó phải hiển thị ra thằng `selectedRow` -> Mong muốn của mình là khi mà mình click vào cái thằng nào đó thì chúng sẽ thêm cái class của nó vào -> sử dụng `getRowClassName` sẽ lấy ra được `row.id`

- Ở trong thằng hồ sơ khi mà cái `Permission.length > 0` thì chúng ta mới cho phép hiển thị nhóm vai trò -> Khi mà khách hàng là `Client` không có quyền quản trị thì chúng ta sẽ không cho hiển thị `Nhóm vai trò`

- Thì ở đây những cái dữ liệu đang ở trong `FormData(React hook form)` nên chưa thể nào mà lấy được -> Nhưng chúng ta sẽ sử dụng thằng `watch` ở bên trong `React Hook form` -> Dùng `watch` để lấy được các data trong `useForm`

  - Thì cái Role lúc này chỉ là một cái id mà thôi nên chỗ này chúng ta vẫn chưa có thể biết được

  - Khi mà vào `myProfile` thì nó đã set lại giá trị của profile đó rồi bằng thằng `cfetchGetAuthMe`

  - Sẽ tạo một biến nữa khi mà chúng ta `getDetailAuthMe` sẽ xử lý ở trong đó thay vì xử lý trong thằng `watch` của chúng ta

- Khi nào mà làm tới quản trị các thằng user thì chúng ta sẽ check thử xem là nó có đúng với cách chúng ta xử lý trong hôm này hay không

### Xử lý phân quyền ở các trang trong hệ thống

- Xử lý phân quyền cho hệ thống

- Sẽ xử lý phân quyền dựa vào permission trong từng thằng user của chúng ta

- Thì ở trong thằng `userData` của chúng ta nó sẽ có thầng `roles` và trong roles nó sẽ có thằng `permissions`

  - Thì sẽ dựa vào cái `permissions` để phân quyền cái trang của chúng ta

  - Dùng `AclGuard` để phân quyền người dùng sau khi mà người dùng đã đăng nhập vào rồi (`AuthGuard` rồi)

    - Dùng AclGuard để mà test nó mới được không thì không được

  - Ở trong Acl.ts mà ở trong hàm defineRulesFor mà chúng ta không có return về cái gì cho nó hết thì khi mà vào phần Admin page thì chúng ta sẽ bị trả ra lỗi là `You are not Authorized`

  - Thì ở đây ví dụ là trang nhòm vai trò thì chúng ta sẽ không cho nó vào trang nhóm vai trò khi mà nó không có quyền `view` trang nhóm vai trò đó -> Dù cho nó có quyền tạo sửa xoá mà nó không có quyền view thì cũng không cho nó vào -> Thì lúc đó chúng ta sẽ hiển thị lên là `You are not authorized`

  - Nên là khi mà dựa vào cái đó thì chúng ta sẽ xử lý trong từng cái page chúng ta như thế này -> Đầu tiên là sẽ vào thằng `_App.tsx`

    - Thì ở trong đây chúng ta có nhận một thằng là `aclAbilities`

    - Do thằng `subject: all` ở `defaultACLObj` nó khá là khó hiểu một chút nên là chúng a sẽ bỏ đi và chỉ giữ lại `action: manage`

    - Sẽ check dựa vào permission của thằng `user` đó -> Nếu mà nó có thì chúng ta sẽ dùng thằng `can('manage', 'all')` trong thư viện để trả về -> Nếu không thì sẽ không trả về cái gì cả thì lúc đó nó sẽ không có quyền

    - Thì bây giờ nhiệm vụ của mình là tương ứng với từng cái `page` ở trang `Admin` thì chúng ta sẽ truyền cái `permissions` của chúng ta vào trong đó

    - Nên bây giờ chúng ta sẽ đi từ page -> Ví dụ như với nhóm vai trò là `Nhân viên` chúng ta sẽ truyền vào là những cái chức năng của nhóm vai trò đó `ví dụ như là: SYSTEM.VIEW.ROLES, SYSTEM.CREATE.USERS` -> Nếu mà thằng User có quyền thì chúng ta sẽ cho nó vào cái trang đó còn không thì đá nó về trang `You are not authorized`

    - Bây giờ phải truyền cái `permissions` cho từng cái page của chúng ta -> Thì chúng ta sẽ vào từng cái page đó và check cái quyền của nó ví dụ như sau: `Index.permission = PERMISSIONS.ROLE.VIEW`

      - Chúng ta sẽ cho nó là một cái permission: string[] để sau này khi mà chúng ta check quyền cho nó ví dụ như chúng ta check `Delivery` và `City` chung một cái page thì cần phải có một cái `array` để chứa quyền cho 2 thằng đó -> Để `array` để sau này có thể mở rộng ra hơn nữa

    - Ở những cái page nên là `gắn - mount` nó vào trước khi mà `export` cái trang đó ra -> Thì thằng `AclAbility` có thể là chúng ta sẽ không dùng tới nữa -> Ở đây chúng ta sẽ sử dụng thằng `permission` để thay thể phân quyền đối với người dùng

    - Luc này khi mà đã có được cái permisison rồi -> Thì lúc này khi mà vào nhóm vai trò thì nó sẽ có được là -> Còn các page khác nếu mà chúng ta không để vào thì chắc chắn là nó sẽ không có

    - THì lúc này chúng ta sẽ dựa vào cái permission trong cái page của chúng ta của chúng ta -> Và lúc này chúng ta có lấy ra được cái `permissionUser` khi mà người dùng đăng nhập vào rồi

      - thì lúc này sẽ lấy ra `permissionUser` của người dùng mà vào, và cái `permission` của cái page mà chúng ta đăng nhập vào

      - Thì nếu như mà cái permission không có, có nghĩa là cái `page` của chúng ta là `public` thì chúng ta không cần phải `check` -> Thì ở đây lúc này chúng ta chỉ cần check là `!permission.length` là không có gì(`Nghĩa là cái page đó đang public`) thì chúng ta vẫn cho nó vào hoặc là nó bao gồm cả `PERMISSIONS.ADMIN` của chúng ta hoặc là thì tất cả thầng `permission[]` thì nó phải nằm trong permissionUser của chúng ta thì sẽ được cho phép `permission.every((item) => permissionUser.includes(item))`

      - Còn một cái nữa là khi mà cái permissionUser của chúng ta nó là thằng `BASIC` thì nó chỉ có quyển `PERMISSIONS.DASHBOARD` mà thôi nên là

        - Nếu như là người dùng đó có quyền bao gồm `PERMISSIONS.BASIC` thì mình sẽ đổi cái `permissions` của nó thành thằng `PERMISSIONS.DASHBOARD` -> Tại vì chúng ta không thể nào mà để như vậy để mà check quyền được nên là cần phải đỏi qua thằng `PERMISSIONs.DASHBOARD` để mà check quyền

        - Thì chỉ cần trong lúc check permission thì chúng ta chỉ cần check nhẹ chỗ `PERMISSIONS.BASIC` là được

        - Còn nếu mà nó không gồm `PERMISSIONS.BASIC` thì chúng ta sẽ lấy chính thằng permissions từ contextApi `auth.user.role.permissions`

        - Giả dụ bây giờ chúng ta sẽ hard cái `permissions` thử như sau `permissionsUser = ['SYSTEM.USER.VIEW']`

        - Khi mà đổi trên UI t hì nó có thể vẫn chưaa thay đổi và work ngay lập tức -> nhưng ở dưới API thì nó đã được đổi rồi nên là cứ an tâm là nó đã bị chặn ở dươi API rồi

        - Vậy là chúng ta đã thực hiện xong cái `permissions` ở chỗ này rồi bây giờ chúng ta sẽ thực hiện phân quyền tiếp các phần khác -> Tạm thời phân quyền ở các page nó sẽ như thế nay sau này có lỗi thì chúng ta sẽ fix tiếp

        - Thì lúc này chúng ta cần phải thay đổi cái format code của chúng ta lại -> Chúng ta thấy rằng khi mà thằng `activePath` thì chúng ta cũng cần phải `active` theo cái `path` nó nữa tại vì ví dụ như chúng ta đang đứng ở thằng `/system/user` mà khi chúng ta F5 lại nó vẫn ở cái URL đó nhưng nó vẫn không có `active` -> Nên là chúng ta sẽ `active` theo cái `path` của nó nữa

        - Chủ yếu set cái `activePath` theo thằng `router` mà thôi -> Thì ở trong thằng `router` nó sẽ có thằng `asPath` và thằng `pathName` nó sẽ là thằng activePath của chúng ta ở đây, ở đây chúng ta sẽ lấy thằng `asPath` -> Và sẽ sử dụng thằng useEffect để mỗi lần mà router thay đổi thì sẽ chạy lại

        - Nhưng mà khi back về trang đó thì cái trạng thái `open` của các `thằng con` trong vertical nó không mở ra -> Chúng ta mong muốn là thằng con khi mà nó `activePath` và khi chúng ta `back` về thì nó phải mở ra

        - Sẽ dùng lại cái hàm `isParentHaveChildActive` để tìm ra thằng cha của thằng `activePath` đang active

        - Với mong muốn là thằng con đang `active` mà chúng ta chuyển cái `path` đi thì nó vẫn phải mở cái thằng con đó ra -> Mục đích của chúng ta là chúng ta sẽ tìm đến thằng children mà đến khi nào mà không còn thằng children nào nữa thì chúng ta sẽ lấy ra title của thằng `đầu tiên` tức là thằng `cha(parent)` chứa nó(khi mà nó có cái title đó) -> Thì nó sẽ tương tự như thằng kia thôi `(thằng đệ quy dùng để xử lý active với thằng cha vây)`

        - Sẽ dùng thằng find để tìm ra thằng con nào có `activePath` để lấy ra `title` của thằng cha -> Sau khi mà tìm được title của thằng cha rồi thì sẽ set cái `openItems` thì lúc này nó sẽ tự động mở ra

    - Và còn một cái nữa ở phần thanh menuu quản trị khi mà người dùng có permissionsUser.length > 0 tức là user có quyển quản lí cái hệ thống này -> Thì chúng ta sẽ set cho nó cái `permission` có data bên trong

      - Thì lúc này ở trong component `UserDropdown` -> Thì lúc này cái chỗ quản trị hệ thống ở phần UserDropdown -> Thì khi mà nó có quyền trong cái permission của chúng ta thì chúng ta mới cho nó hiển thị `Quản trị hệ thống` -> Không cần quan tâm nó có quyền gì vì chúng ta đã check trong cái `AclGuard` rồi

    - Giải thích về luồng của Acl

      - Truyền permission từ cái page đó vào AclGuard component của chúng ta -> thì trong AclGuard nó sẽ check quyền của người dùng đối với cái trang hiện tại

      - Và sẽ dựa vào cả `permissionUser` đã đăng nhập thì chúng ta sẽ dựa vào cả 2 thằng này để mà phân quyền cho người dùng

      - Ỏ đây sẽ dựa vào cơ chế của nó thì ở đây chúng ta sẽ trả về thằng `can()` là `một hàm của thư viện` thì nó mới có quyền vào cái trang của chúng ta

      - `buildAbilityFor` chỉ là một phương thức của thư viện thôi -> Chúng ta chỉ cần truyền `permissionUser` và `permission` vào là được -> Thì chi cần check vào điều kiện như vậy nếu như nó đủ điều kiện thì sẽ trả về `can('manage', 'all')`

### Xử lý phân quyền ở thanh menu

- Sẽ xử lý phân quyền người dùng trên thanh menu -> Nếu nó không quyền xem bất kì thằng con nào bên trong cái menu thì sẽ ẩn đi cái thằng con đó -> Nếu không có quyền xem tất cả thằng con bên trong thằng cha thì sẽ ẩn đi cái thằng cha đó luôn

- Phân quyền ở menu là khi có quyền với một thz nào đó thì chúng ta mới có thể thao tác được với nó

- Sẽ giải quyết cái vấn đề còn tồn đọng ở phần trước là -> Mặc dù là ở đường link URL là vẫn đang có nhưng khi mà chúng ta `back` lại thì cái `activePath` nó vẫn `active` nhưng mà `openItems` thì nó không được mở ra

  - Thì chúng ta đã truyền vào cái `item` và `activePath` rồi -> Bây giờ chúng ta sẽ lấy ra cái `parentTitle` -> Thay vì tạo ra một cái useEffect nữa để mà phụ thuộc vào thằng `activePath` rồi chạy cái function `findParentActivePath` -> Nên là lúc này chúng ta sẽ xử lý trực tiếp ở bên trong thằng useEffect của xử lý `router.asPath` luôn -> Thay vì chúng ta đợi thằng `activePath` nó được set rồi thì chúng ta gán trực tiếp cái value `router.asPath` vào thằng function `findParentActivePath` luôn

  - Ở trong cái function này chúng ta sẽ sử dụng cái vòng lặp để lặp qua các `items` trong array -> Để mà lấy ra được các thằng con mà trùng với `activePath` mà chúng ta truyền vào -> Nếu mà tìm được thằng cha thì lấy ra cái `parentTitle` của thằng cha đó

    - Cái nhiệm đầu tiên của chúng ta là chúng ta sẽ check cái item -> nếu như mà cái item.path -> Thì chúng ta sẽ return về cái `item.title` luôn

    - Ở đấy của chúng ta còn một cái trường hợp nữa -> Nếu như mà `item.childrens && item.childrens.length > 0` -> Thì lúc này chúng ta sẽ tìm tiếp thằng con mà chứa nó thì nó mới chính xác được -> Khi mà có được thằng child mà có `item.path === activePath` rồi thì chúng ta sẽ return về title

    - Nhưng mà ở đây nó sẽ có lỗi đó chính là nó sẽ trả về cho chúng ta cấp gần nhất thay vì là cấp lớn nhất -> Để mà trả về thằng lớn nhất thì chúng ta cần phải return về thằng hệ thống thay vì return về thằng `child` -> Nên là ở đây là thằng cha nào mà có thằng con thì nó sẽ lặp đệ quy liên tục -> LÚc này nó sẽ lấy ra được title của thằng cấp lớn nhất

    - Lúc này khi mà đã có được parentTitle rồi thì chúng ta sẽ thực hiện `setOpenItems` cho thằng đó

    - Ok rồi đã xử lý được thằng `activePath` tự động mở ra khi chúng ta back về từ một cái trang khác rồi

- Tiếp theo sẽ xử lý permission và permissionUser của chúng ta -> Thì ở trong object `VerticalItems` thì phải khai báo thêm `permission` của những thằng con trong đó tại đó

  - Nếu có quyền tạo mà không có quyền view thì nó vẫn không thể vào cái List của chúng ta được nên là chỉ cần check quyền view là được

  - Viết một cái hàm filter quyền ở bên trong component `ListVerticalLayout` -> hàm `formatMenuByPermission`

    - Chúng ta sẽ check nếu là có menu thì chúng ta sẽ return về những thằng menu và kết hợp với phương thức filter -> Ở đây chúng ta cần viết thêm một cái hàm khác `permission` nữa rồi

    - Với cái permission của nó thì nó sẽ có quyền là như thế nào -> Chỉ cho phéps trả về true với function `hasPermission` khi mà cái permissionUser.includes(item.permission) || !item.permission || permission.includes(PERMISSIONS.ADMIN)

  - Sau khi mà chúng ta đã check quyền rồi thì tiếp theo chúng ta sẽ thực hiện việc format lại cái `ListVerticalLayout`

    - Khi mà `filter` mà return về true thì nó sẽ giữ nguyên tất cả các item của chúng ta, khi mà return về false thì nó sẽ bỏ đi các item của chúng ta `(không lấy bất kì thằng nào ở trong đây cả)`

    - Do `ListVerticalLayout` có nhiều cấp nên là chúng ta cần phải đệ quy ở đây -> Cần phải đệ quy vào rồi check children && children.length là có thì mới xét tiếp nếu không thì nó sẽ tạo ra một vòng lặp vô hạn

    - Lúcc này chúng ta không thể thay thế thằng `childrens` của thằng `permission` mà chúng ta sẽ lọc thằng `childrens` của nó

      - Không thể nào thảy đổi thầng children của `ListVerticalItems` mà sẽ lọc đi dựa vào cái `permissions`

      - Cần phải lọc đi chính thằng children của chúng ta bằng cách thức như sau -> `item.childrens = formatMenuVerticalByPermission(item.childrens, permissionUser)` thì lúc này sẽ lặp luôn cả thằng cha và cả thằng con luôn -> CHúng ta sẽ đệ quy liên tục như thế này.

    - Và cái thứ 2 là -> Hiện tại chúng ta chưa đưa cái `Dashboard` vào trong cái menu của chúng ta -> Nếu không có cái menu thì return về cái mảng rỗng -> Còn nếu không có quyền thì chỉ cần return về `false` là được -> Nếu có quyền thì return về true là được

    - return `true` và `false` thì mặc định nó cũng là một cái array mà thôi -> Nếu là true thì return về thằng item trong đó -> còn là false thì sẽ không return về thằng nào cả, bỏ đi cái thằng đó luôn

### Custom hook xử lý phân quyền

### Giải thích lại về authGuard, guestGuard, aclGuard

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
