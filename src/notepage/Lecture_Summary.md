# Khoá học NextJS 14 Pro với Typescrip

## Chương 1

- `ProductType` có thêm thằng slug là để phục vụ cho `SEO` ở phía `FE`

- Trong khoá học chúng ta cần phải làm việc theo sát thực tế nhất -> Trong team có rất là nhiều thành viên -> Và họ sẽ code rất là nhiều tính năng khác nhau -> Sau đó họ sẽ đưa code cùng một lúc lên cái nhánh `main` của chúng ta -> Code đó có thể code trong 1 2 tháng rồi đưa lên rồi `merge` nhánh `main(nhánh chính)`

  - Từng tính năng thì sẽ tạo nhánh mới tương ứng vói từng tính năng -> Sau khi code xong push code lên nhánh tạo -> Và sau đó sẽ tạo ra 1 `pull request` -> Để yêu cầu leader merge code của họ vào nhánh `main`

  - Ví dụ như khi 2 người code 2 tính năng signIn và signUp và dùng chung một cái `Input` -> Thì sau thời gian code thì code rất là nhiều trong cái `Input` đó -> Dẫn tới khi mà `merge` code vào nhánh `main` thì nó sẽ bị `conflict` -> Cho nên để mà giải quyết conflict thì mất rất nhiều thời gian để check xem giải quyết vấn đề như thế nào -> Nhiều khi họ không thể giải quyết được vấn đề đó -> Có thể họ sẽ xoá code và code lại từ đầu -> Cố thể dẫn đến trễ `deadline` này kia

- Cho nên chúng ta sẽ tìm hiểu về khái niệm CI/CD

  - CI (Continuous Integration) -> Khi mà tạo pull request xong thì CI nó sẽ tự động chạy và nó sẽ check xem là - khi mà mình `merge` cái code từ nhánh của chúng ta đưa lên nó có bị lỗi hay không -> Nếu có thì nó sẽ không cho chúng ta `merge` vào nhánh `main` -> Và nó sẽ chỉ định cái file đang bị `conflict` của chúng ta để chúng ta giải quyết cái `conflict` đó -> Khi mà giải quyết xong thì nó sẽ tự đông chạy một lần nữa -> Khi mà cái code đó chạy thành công thì sẽ merge pull request vào -> Hầu như trong thực tế thì leader là người `merge` `pull request` -> Khi mà merge vào thì lúc này code nó sẽ tự động deploy lên production luôn

    - Có 2 môi trường - và môi trường `develop` giành riêng cho những `tester` để họ kiểm thử phần mềm

  - CD (Continuous Deployment/Delivery) -> Sẽ check xem khi mà nhánh chính của mình có sự thay đổi thì nó sẽ `deploy` lên lại thì thằng CD chỉ có vậy thôi

    - vercel_token: Jiv6IQq7SWdj6EhD9UommMjX

    - Những CI_CD nó sẽ chạy vào cái `job` phía dưới khi mà chúng ta push code vào nhánh main

    - Với lại khi mà chúng ta merge pull request vào thì cũng chạy những cái `job` phía dưới -> Chúng ta sẽ thêm cái action là `pull_request` thay vì push trực tiếp trên nhánh main

    - Tóm lại những cái `job` phía dưới nó sẽ chạy khi mà chúng ta push code vào nhánh main hoặc là merged 1 cái `pull request` vào nhánh main

    - Sau này khi mà merge code lên nhánh master thì nó sẽ tự động chạy lại mà thôi

### Setup phần CI_CD cho dự án của chúng ta

### Giải thích phần custom theme trong Material UI

- Thì thằng setting nó không có gì hết chi là settings của những cái config của từng component trong `MUI` mà thôi -> Chỉ cần tập trung vào thằng `mode: light` ở đây mà thôi

- Nếu mà dùng dark modoe thì chỉ cần thay đổi giá trị trong thằng `settingContext` của chúng ta là đượcc => Chỉ cần thay đổi thằng `mode` thì những `component` của chúng ta sẽ tự động thay đổi theo

## Login, Logout, phân quyền trong nextjs14, dark mode với MUI, đa ngôn ngữ

### Tạo custom component text field cho dự án

- Chúng ta sẽ không sử dụng thằng textField của MUI mà chúng ta sẽ tạo ra - custom thằng text field cho chúng ta

- Thẻ Box trong `MUI` như là thẻ `div` của chúng ta

- Thay vì sử dụng trực tiếp `theme` từ hooks `useTheme` thì chúng ta sẽ sử dụng trực tiếp từ `styled` của thằng MUI `luôn`

### Xây dựng UI Login Page(Dùng Yupp, use-hook-form để validate trong form)

- Sẽ không viết code UI của login trong thằng `page-router` của chúng ta mà sẽ viết riêng ở cái folder khác -> Tại vì thằng này không dùng server side rendering để render ra data hay thumbnail nên là chúng ta sẽ viết như thế này -> Khi nào mà sử dụng SSR thì chúng ta sẽ viế theo cách khác "prettier"

- Sẽ bắt luôn sự kiện checkbox cho thằng `Remember me` luôn

- Dùng Yup để lấy ra state của thằng `Remember me`

### Hoàn thành UI trang login

- Dùng Image của nextjs thì nó sẽ giúp chúng ta tải ảnh nhanh hơn nhiều so với những thằng kia

- phải sử dụng từ thằng theme tại vì sau này khi sử dụng chế độ darkmode sẽ tự động đổi lại màu -> Và để cho sau này muốn đổi màu thì nó sẽ dễ hơn

- Sẽ hướng dẫn reponsive với thằng MUI luôn

### Xây dựng và hoàn thiện UI trang Register

### Tổng quan về luồng login, register

- Chúng ta sẽ tìm hiểu tổng quan về luồng login và register trong đây

### Luồng hoạt động của phần auth ở API

### Integrate API login cơ bản

- Thay vì phải dùng thằng rẽdux thì `loginAuth` sẽ sử dụng thằng `context` -> Thì tại sao lại sử dụng thằng `contextApi` thì những bài sau sẽ giải thích rõ

- Lúc này `handleLogin` nó đang nằm trong `authContext` -> Khi mà chúng ta login thì nó sẽ truyền những cái tham số như email, password, rememberme vào `authContext` cho chúng ta

  - Nếu mà `rememberMe` là true thì sẽ lưu `access_token` vào `localStorage` cho chúng ta và sẽ lưu luôn `userData` của chúng ta vào `localStorage` luôn

  - Sử dụng `useAuth` là `authContext` được viết ra dưới `customHook` -> để lấy ra thông tin sau khi đã đăng nhập thành công

  - Hiện tại thì sau khi đã đăng nhập xong thì chúng ta vẫn chưa thực hiện các lớp bảo vệ cho nó `Guard` -> Vấn đề về `Guard` thì chúng ta sẽ thực hiện ở các video sau

### Xây dựng layout cơ bản cho dự án

- Sẽ xây dựng cái `UI login` -> `Dropdown` sau khi đã đăng nhập thành công để hiển thị thông tin người dùng -> Và hoàn thiện thành `login`

- Trong thực tế thì đừng nên code từ đầu nó sẽ rất mất thời gian và dẫn đến trễ deadline nữa

- Login sẽ truyền cho nó cái props để nó biết được là nó có hiển thị `UserLayout` hay không -> Sẽ xây dựng khung layout trước sau đó rồi mới tính tới việc xử lý layout cho `login` `register`

- Thì những cái icon sau này sẽ tạo ra một `config MENU` để `render` chứ không import như trong `component listItem` gây ảnh hưởng đến cho người dùng

### Custom BlankLayout cho dự án

- Thì lúc này những trang như login register hay 404 không muốn hiển thị `UserLayout` -> Thì chúng ta cần phải custom thêm một cái `layout` nữa

### Custom navigation vertical cơ bản

- Sẽ tạo ra một cái config của `Vertical Item` -> Thì ở trong đây sẽ chứa `list Item` của chúng ta

  - Thứ nhất là cái `icon`, thứ 2 là `submidder` đế biết thằng nào là thằng con hoặc là children cũng được để biết được là thằng nào là thằng con

  - Tại vì thằng này sẽ không có tái sử dụng nhiều nên là chúng ta sẽ tạo trong layout folder luôn

  - Cứ tạm thời lặp nó qua như vậy sau này chúng ta sẽ `custom` lại -> Vì chúng ta còn phải xử lý chỗ phân quyền các cái `menu` nữa

  - Sẽ thêm vào thằng `path` để mỗi lần mà click vào thì sẽ đá nó sang cái đường link khác -> Cái này chúng ta sẽ xử lý nó sau hiện tại chúng ta đang tập trung xây dựng UI cho trang web

  - Tạm thời chúng ta chưa tính tới chuyện ở trong có thằng `children` -> Lúc mà có `children` thì chúng ta chỉ cần gắn thêm component `Collapse` và gắn cái thằng children vào `ListItemButton` và bắt cái sự kiện cho nó

    -> Lúc này cần tạo ra 1 cái Item nữa -> `Item` `flashList` gì đó -> Sẽ custom thằng `ListItemButton > ListItemIcon - ListItemText` là một cái component riêng -> Thì khi mà chúng ta `click` mở thì nó sẽ theo từng cái riêng nó không có chúng với nhau

  - Để ý rằng trong cái `ListItemButton` mà có thằng con phía bên dưới thì -> Để mà biết được ở dưới thằng `children` chúng ta có đang `click` vào cho nó không thì sẽ dựa vào cái `handleClick` ở `ListItemButton`

  - Do hiện tại thằng open nó đang work cho tất cả các thằng con ở bên trong nên là khi nhấn vào một thằng cha thì các thằng khác đều mở ra

    - Thì lúc này chúng ta cần tách thằng Collapse ra thành một cái component riêng -> Thì lúc này state `open` sẽ tương ứng với từng thằng component và nó sẽ không work với nhau nữa

  - Và cái thứ 2 khi mà chúng ta truyền cái item children vào cái component của chúng ta -> Thì chúng ta cần phải dùng thầng `recursive` -> Để khi mà chúng ta truyền thêm thằng `children` ở bên trong thằng `children` nữa thì nó sẽ clone ra hết cho chúng ta

### Hướng dẫn sử dùng kỹ thuật recursive để xử lý navigation vertical

- Dùng đệ quy để render ra thằng `children` bên trong thằng `children`

- Thì trong thực tế mỗi thằng `children` nó sẽ có nhiều cấp bậc khác nhau -> Và mỗi thằng children sẽ có một sự kiện `onClick riêng` và `state riêng`

  - Chúng ta sẽ tạo ra một biến là `Recursive`

  - Thì lúc này nếu mà ở dưới có thêm một children nữa thì chúng ta cần phải gọi lại chính cái `RecursiveListItem`

  - Thì khi mà làm như này thì nếu mà thằng con nó `children.length > 0` thì nó sẽ vẫn chạy lại cái component `RecursiveListItem` và render ra children bên trong đó ra giao diện.

  - Chúng ta muốn rầng mỗi một cấp thì nó sẽ hụt vào một tí -> Thì chúng ta sẽ tạo ra một thuộc tính là `level` -> Sẽ dùng cái Level này để CSS cho thằng children

  - Tạm thời chúng ta sẽ thực hiện cái logic `Vertical RecursiveListItem` như vậy sau này có `icon` chúng ta sẽ bổ sung vào sau

  - Với lại khi mà chúng ta click vào thằng từng thầng thì gần như là thằng `children` là có `path` thôi những thầng còn lại thì sẽ không có `path`
    - Thì lúc sau này khi mà click thì chúng ta sẽ bắt sự kiện `click` của nó và nó tới cái trang đó là được.

### Hoàn thành layout cho dự án

### Xử lý sau khi login thành công

### Improvement lại luồng login, logout

### Xử lý lại luồng AuthGuard, GuestGuard cho dự án

### Interceptor trong Nextjs 14

### Dark mode trong Nextjs 14 với Material UI

### Đa ngôn ngữ với react-i18next trong nextjs 14

### Phân quyền cho dự án trong nextjs 14

### Cải thiện luồng login và tạo route cho trang my profile

### Tạo UI cho trang my profile P1

### Hoàn thiện UI cho trang my profile

### Tích hợp Redux toolkit - Redux Thunk - Hoàn thiện luồng register

### Phân tích luồng phân quyền ở API

### Tích hợp API ở my profile (xử lý base64)

### Xử lý phân tách chuỗi cho fullName và cải thiện UI User Dropdown

### Custom component loading

### Improve luồng login và hoàn thành tính năng thay đổi mật khẩu

### Xây dựng cơ chế nhớ mật khẩu

### Tạo custom component select
