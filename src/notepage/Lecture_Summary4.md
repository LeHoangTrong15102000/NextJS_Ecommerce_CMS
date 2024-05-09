# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

- Trả được 4 kỳ rồi thì tiếp tục vay lại bên SHB Finance số tiền là 70tr(nếu lãi là hợp lý)
- Trả được 3 kỳ rồi thì tiếp tục vay lại bên FE Credit số tiền là 20tr(nếu lãi là hợp lý)
- Trả được hết kỳ rồi thì tiếp tục vay lại bên HD Saison số tiền là 40tr(nếu lãi là hợp lý)

## Danh sách sản phẩm ở trang HOME

### Phân tích về sự khác nhau giữa SSR và CSR

- Thì ở trang HOME sẽ hiển thị những sản phẩm public của chúng ta -> Nên là sẽ chúng ta sẽ sử dụng các API `ProductPublic` ở trang HOME này

- Thì ở trang HOME là chúng ta sẽ sử dụng thằng SSR để mà render ra giao diện đồng thời tăng SEO Cho trang web -> Thì thằng CSR nó sẽ giảm tải cho server của chúng ta nhưng nó sẽ không tối ưu SEO cho trang web của chúng ta -> Nên là do đó chúng ta sẽ sử dựng thằng `SSR` cho phía của người dùng `user` còn CSR cho phía của admin trang web

### Xử lý UI cho card sản phẩm

- Do ở trang HOME chúng ta sẽ sử dụng SSR nên là không thể sử dụng thằng redux được -> Thì ở thằng redux vẫn có sủ dụng được ở cơ chế là SSR nên nó sẽ khá là phức tạp -> Chúng ta sẽ tạm thời để như vậy trước rồi sẽ xử lý cho những chỗ này sau

- Vì với thằng API Public khi mà không đăng nhập thì chúng ta vẫn có thể call API được

- Chúng ta sẽ custom lại giao diện trang HOME của thằng website của chúng ta

### Integrate API cho danh sách sản phẩm và chỉnh sửa UI cho trang list product

- Sẽ call ở client trước rồi sau đó sẽ call tới server để phải khỏi bỡ ng ỡ

- Nhưng sản phẩm ở trên `Tablist` thì chúng ta phải hiển thị ra theo cái thằng `types` của nó

- Chưa trả về cho chúng ta là bao nhiêu người đã đánh giá sản phẩm này rồi,

  - Tương tự thì discount cũng chưa trả về, và thằng like sẩn phẩm cũng chưa

  - Sauu này khi mà có review rồi thì sẽ có thằng filter theo giá tiền theo số sao của chúng ta nữa

  - Sẽ thêm vị trí của thằng sản phẩm này ở đâu và nó được ship từ đâu đến nữa - và ship đến đâu nữa

### Xử lý bộ lọc, filter, và phân trang cho danh sách sản phẩm

- Khi mà lấy được productType về rồi chúng ta sẽ set vào `setProductTypeSelected`

- Ở đây khi mà trang HOME ở bên phía tay trái thì nó sẽ có thêm là filter theo

- Thì ở trong cái grid container thì chúng ta sẽ thay đổi thêm chút nữa

- Thì ở trong FilterProduct sẽ là `Radio` để mà chúng ta chọn ở đây

- Tạo ra constant để chứa các review của chúng ta

- Chỉ cần truyền thầng review min lên là được không cần phải truyền cả thằng max lên

- Do cái thằng FilterProduct nó trả về cho chúng ta như vậy rồi (với `height: full`) nên là chúng ta sẽ xử lý chỗ này

- Ở đây chúng ta chỉ xây dưng layout cho phần filter trước thôi -> Sau này chúng ta sẽ tích hợp API vào để có thể `filter` theo các danh mục

- Sau này sẽ thêm các trường filter như là `phổ biến nhất`, `bán chạy nhất`

- Cách truyền biến vào file `json locale` của chúng ta

- Sẽ truyền minStar và maxStar ở trong filter Product của chúng ta

  - Sẽ bắt sự kiện onChange ở phần `RadioGroup`

  - Mặc định khi mà click vào thì nó sẽ là value của thằng radio đó luôn

  - Chúng ta cần làm soa khi mà thay đổi cái filterReview thì nó truyền cái data từ bên `FilterProduct` qua trang quản trị sản phẩm và call lại cái API của chúng ta

    - Thì có thể tạo ra cái function trên thằng cha và truyền xuống thôi

### Tạo UI cho trang chi tiết sản phẩm

- Sẽ tạo ra thằng `slug` để mà tạo ra thầng Url thân thiện với SEO

  - ở đây cái hàm chúng ta sẽ để là id trước chút nữa sẽ có những cái improve sau

  - Thì lúc này khi mà ở trang của thằng `product/slug` thì làm sao mà chúng ta biết được `_id` của thằng đó

    - Trong trang DetailsProduct thì chúng ta vẫn có thể call bằng thằng slug được

    - Thì thằng slug nó giống như là Id và nó cũng `unique` như là `productId` vậy

    - Chúng ta sẽ sử dụng thằng `router.query` nó sẽ lấy ra được `productId` -> Thì lúc này sẽ

    - Thì là lúc này chúng ta sẽ check là nếu mà có được `productId` thì chúng ta mới call `getDetailsProduct`

  - Chúng ta sẽ xử lý ở dưới backend với cái `slug` như là một `productId` của chúng ta luôn

  - Ở đây chúng ta có làm thống kế những cái sản phẩm mà thằng user xem nên là trong cái API chúng ta thêm một thằng là `viewedProduct` -> nếu mà call cái productDetailsPublic thì sẽ đưa vào cái `listProduct` mà user đã `view`

    - Cho nên là lúc này tạo thêm `userId` để đưa vào

  - Nhưng mà cái description của chúng ta là một đoạn HTML làm sao để mà hiển thị ra được đoạn text văn bản

### Improve UI và fix lỗi ngày giảm giá của sản phẩm

- Khi mà thêm ngày bắt đầu giảm giá và ngày kết thúc giảm giá thì nó sẽ bị lỗi vì chúng ta đưa cái ngày vào nó không đúng format với thằng `datePicker` nên là nó bị lỗi -> Thì thằng datePIcker nó sẽ có dạng là `Sun Feb 04 2024 GMT+0700 Indochina Time` còn của chúng ta sẽ là `..00:00.000Z` như vậy

  - Thì khi mà chúng ta đưa lên thì thằng `Axios` hay thằng gì đó sẽ chuyển dạng time của chúng ta sang dạng là `stringify` nên là nó sẽ bị lỗi

  - Nên là khi mà lấy dữ liệu từ server lên thì khi mà nó có chúng ta sẽ convert nó sang dạng là Time bằng cách `new Date(data.discountStartDate)` `new Date(data.discountEndDate)`

  - Sẽ hướng dẫn lấy ảnh từ desktop của chúng ta vào thằng thư viện `react wysiwyg` sau thay vì chúng ta copy cái ảnh từ đâu đó và quăng vào

  - Tạo ra hàm utils để mà `convert` giá tiền của sản phẩm

- Khi mà vào trang HOME thì nó call 3 lần của thằng `filterProduct` -> Nên là đôi lúc chúng ta sẽ thấy được hết sản phẩm đôi lúc sẽ chỉ thấy được sản phẩm của `types` đó mà thôi -> Thì cái việc này chúng ta sẽ tối ưu sau

### Xử lý thêm sản phẩm vào giỏ hàng P1

- Khi mà không có vay trên FE thì bớt đi được 1 khoản vay -> Nên là bớt được 1 khoản vay

- Thế nên là để mà đồng nhất được quá trình từ trang HOME `CardProduct` và `CartProduct` ở `HorizontalLayout` được thì phải đưa nó lên redux của chúng ta

- Cái thứ 2 là khi mà lưu sản phẩm vào trong giỏ hàng thì cái lúc này chúng ta không có lưu vào trong database -> Thì chúng ta mong muốn khi mà reload lại thì sản phẩm vẫn ở trong giỏ hàng của chúng ta -> Thì lúc này chúng ta cần đưa sản phẩm của chúng ta vào trong thằng `redux`

- Sẽ thêm những thông tin này vào trong listOrder của chúng ta như là `name` , `amount`, `image`, `price` `discount` `product`

- Thằng `FilterProduct` hiện tại thì nó đang call 3 API cùng một lúc nên là nó bị lỗi ở phần hiển thị sản phẩm lên trang `HOME` -> Nên là chúng ta sẽ improve cái vấn đề này sau

- Thì lúc này sẽ thực hiện cái logic khi mà add `productItems` vào bên trong giỏ hàng, `Item` giống thì sẽ tăng lên 1, còn là `Item` khác thì sẽ được thêm vào giỏ hàng

  - Viết ra một cái hàm nếu như mà cái sản phẩm mà chúng ta vừa add nó có cái Id trùng với `Id` ở bên trong `orderItems` thì sẽ tăng số lượng nó lên

  - Tạo ra hàm `convertUpdateProductToCart` thì mà để chắc chắn thì chúng ta sẽ dùng `try-catch`

    - Đầu tiên là chúng ta nên clone nó ra bằng cách `[...orderItems]` nhưng mà cái vấn đề này nó sẽ sinh ra lỗi thì xíu nữa chúng ta sẽ giải quyết

    - Cái này liên quan đến `immutable` ở trong redux -> Tại vì chúng ta sử dụng trong try-catch nên là khi có lỗi thì nó sẽ trả về lỗi ở bên trong cái `catch` của chúng ta nên là chúng ta sẽ không thấy có lỗi được

      - Thì lúc này chỉ có thể clone được ở cấp đầu tiên của thằng object mà thôi

### Xử lý việc lưu giỏ hàng theo từng user và improve API list sản phẩm

- Khi mà `reload` lại thì vẫn lưu được cái `list` sản phẩm trong cái giỏ hàng của chúng ta -> Thì cái trường hợp này chúng ta sẽ lưu vào trong `localStorage` các sản phẩm ở trong giỏ hàng của chúng ta

- Khi mà lần đầu `render` hay `re-render` lại thì lấy giá trị của thằng trong `localStorage` để mà render ra lại giao diện

- Thì lúc này chúng ta cần lấy được giá trị ở trong `localStorage` là các items mà chúng ta đã thêm được vào trong giỏ hàng -> Nên là sẽ dùng thằng `useEffect`

- Khi mà reload lại thì dispatch cái actions của chúng ta vào trong Redux

- Khi không đăng nhập mà biết giỏ hàng thì nó đang bị sai -> Nên là ở đây chúng ta sẽ chỉnh sửa lại cái `productCart` theo từng người dùng

  - Cách để improve cái này thì rất là đơn giản mà thôi -> Thì ở trong thằng cardProduct thì chúng ta sẽ không lưu thằng `orderItems` dưới dạng array nữa

  - Việc đầu tiên là lấy ra data ở trong cái giỏ hàng của chúng ta từ `localStorage`

  - Chúng ta sẽ không lưu data của chúng ta ở dưới dạng `setLocalProductToCart(listOrderItems)` mà sẽ lưu dưới dạng là `{userId : arrayProductCart}`, ví dụ một người đăng nhập thì sẽ gán `userId` là 1 người khác đăng nhập thì sẽ gán `userId` là 2

    - Trước tiên là sẽ gán như vậy, chút nữa sẽ chỉ cách `lấy ra`

  - Thì để mà lấy được những thằng đó thì -> Thì lúc này để mà lấy được thằng `userId`, thằng `user` đang đăng nhập ở đây thì chúng ta sẽ lấyy nó từ thằng `useAuth`

  - Lúc này nó sẽ add cho chúng ta một cái `object` với key là id của thằng `user` và `value` là array chứa các sản phẩm của `user` đó -> `Cách này cũng hay ho đó`

  - Thì lúc này vào bên trong thằng `cart-product` -> Để lấy được sản phẩm của thằng `user` đó thì rất là đơn giản lúc này chúng ta chỉ cần `parseProduct[user?.id]` là được

  - Lúc logout ra rồi cái giỏ hàng vẫn còn nằm ở bên trong redux nên lúc này sản phẩm vẫn còn là chuyện bình thường -> Nên là lúc này khi mà `logout` ra rồi thì chúng ta sẽ clear đi data ở redux -> Thì chúng ta chi cần `dispatch` một cái `orderItems` bằng một cái array rỗng là được

  - Không nên xoá local bởi vì khi mà chúng ta `login` lại thì chúng ta vẫn cần có data để hiển thị ra phía UI -> Nên là không thể xoá local được

  - Bây giờ sẽ quay lại trang HOME và improve thằng API `getAllProductPublic` luôn -> Vì nó call nhiều quá thì no sẽ gặp vấn đề

    - Ở đây nó call 3 cái API `getAllProductPublic` cùng một lúc luôn nên là

    - Khi mà `fetchAllType` mà chúng ta không có `setFilter` cho nên là API `getAllProductPublic` không gọi lần thứ 2 là đúng

    - Do là ban đầu object rỗng tại thằng `filterBy` nó đã làm hàm `handleGetListProducts` chạy một lần rồi và khi nó chạy vào thz `useEffect` nó lại tạo ra thằng object mới có `productTypeSelected là rỗng` và `reviewSelected là rỗng` thì nó lại chạy một lần nữa

    - Nên là cách tối ưu chỗ này là khi mà có `productTypeSelected` thì chúng ta mới set lại cái `setFilterBy`

    - Nên là lúc này chúng ta cần tạo ra thằng useRef để khi mà thằng fetchAllType nó chạy xong thì hàm `handleGetListProducts` nó mới chạy như vậy thì thằng API nó chỉ chạy một lần thôi -> thằng `useRef` khi mà nó thay đổi thì nó sẽ không re-render lại cái component của mình -> Giống như thằng `tham chiếu` của mình thôi

      - Thằng useRef ban đầu nó sẽ là `.current` và có giá trị bên trong

      - Cái nhiệm của chúng ta là khi cái thằng `firstRender` nó bằng true thì chúng ta sẽ gọi đến hàm `handleGetListProducts`

      - Thì cũng tương tự như vậy khi mà thằng `firstRender` nó là true thì mới `setFilterBy` của chúng ta

      - `firstRender.current` chúng ta sẽ chuyển sang true khi mà nó có được thằng `productTypes` của chúng ta

      - Lúc này đã improve được cái `performance` của nó ở đây rồi

    - Và khi mà chúng ta logout đi rồi thì nó sẽ không gọi `getAllProductsPublic` nữa

### Cập nhật những thay đổi ở API và xử lý popup giỏ hàng

- Trong product thêm vao thằng location cho sản phẩm

- Khi mà bấm vào cancel thì t hay đổi status của thằng `orderProduct`

  - Tất nhiên là khi `cancel` thì số lượng từng sản phẩm trong cái `order` sẽ được cộng lại -> Đã được thực hiện ở bên trong service của trên server rồi nên là không cần phải làm gì đâu

  - Cái tình trạng khi mà logout ra mà không thể callAPI đã được khắc phục lỗi là do thằng blackList khi mà chúng ta logout ra thì cái `accessToken` bị đưa vào blackList có thể đây là nguyên nhân dẫn đến bị lỗi API không thể call

- Thêm những cái API cho thằng Dashboard của chúng ta

- Tất cả những thằng có nhóm vai trò vào được CMS admin thì đều có quyền xem được `Dashboard` hết

  - Thì khi mà chúng ta thêm một nhóm vai trò thì mặc định chúng ta phải thêm `PERMISSIONS.DASHBOARD` vào

- Xây dựng `UI` cho giỏ hàng ở ngoài trang `HOME` của chúng ta, khi mà click vào hay là `hover` vào thì nó đều sẽ xổ ra cái giỏ hàng cho chúng ta

  - Có thể removeBackground của tấm ảnh khi mà chuyển sang `darkmode`

  - Lúc này sẽ đưa thằng orderItems vào trong cái popup, sẽ thực hiện custom lại cái popup của chúng ta

- Khi nhấn vào sản phẩm của giỏ hàng thì sẽ đá vào trang `ProductDetail` cuả chúng ta

  - Khi mà call không có gì mà nó vẫn vào trang `detailProduct` là sai nên là chúng ta cần phải improve lại chỗ này

- Nếu như mà đã logout rồi thì không được thêm sản phẩm vào giỏ hàng -> Làm gì có user mà thêm vào giỏ hàng được nên là chúng ta sẽ improve chỗ này

- Do ở Redux thì không liên quan gì đến cái `LocalStorage` của chúng ta nên khi là click vào button `updateProductToCart`

  - Chỗ dispatch cái sự kiện `updateProductToCart` chúng ta không có check cái gì cả nên là nó bị lỗi

  - Còn khi chưa đăng nhập thì nó v ề trang Login và giữ lại cái URL trên thanh URL

### Xây dựng UI cho trang giỏ hàng

- Bắt cái action cho thằng `viewCart` và đá nó đến trang `myOrder`

- Nhiệm vụ của chúng ta là chúng ta sẽ map cái thằng orderItems ra UI

### Xử lý logic cho trang giỏ hàng

- Sẽ thực hiện xử lý logic cho giỏ hàng của chúng

- Bắt sự kiện cho nút tăng va giảm số lượng sản phẩm trong trang giỏ hàng

  - Sẽ nhận vào id của mỗi sản phẩm trong giỏ hàng

  - Xử lý onChange cho hàm input của chúng ta

  - Do ở đây không thể sử dụng state Redux để mà xử lý tăng giảm số lượng cho phần sản phẩm trong trang giỏ hàng được nên là ở đây chúng ta sẽ sử dụng cách khác

  - Nên là ở đây chúng ta sẽ không sử dụng action riêng là `increaseProductOrder` mà sẽ là dùng chung với `action` `updateProductToCart`

  - Khi mà chúng ta update ở phía redux thì chúng ta cũng cần phải update ở phía `LocalStorage` luôn

  - Khi mà add sản phẩm thì chúng ta cần phải biết được số lượng của nó bên trong giỏ hàng -> Nên khi mà người dùng tăng sản phẩm thì không được vượt quá số lượng trong kho

  - Khi mà giảm sản phẩm xuống tới 0 và giảm lần nữa thì sẽ hiển thị lên cái popup là có muốn xoá sản phẩm hay không

  - Nên là cần phải đưa luôn số lượng hàng trong kho `countInStock` vào bên trong khi thực hiện `Increase` hay `Decrease` sản phẩm trong trang giỏ hàng

  - Nên là khi mà giảm xuống tới số 0 thì chúng ta sẽ xoá luôn thằng sản phẩm ở bên trong trang giỏ hàng luôn

  - Ở cái phần mà xoá tất cả các sản phẩm thì có thể xử lý theo 2 hướng

    - hướng 1 là khi mà click vào cái button xoá tất cả `ProductItem` trong cái sản phẩm của chúng ta

    - hướng thứ 2 là ta chỉ xoá với những thằng đã được chọn -> Có nghĩa là đã được checkbox rồi -> Còn nếu là checkbox hết thì sẽ xoá hết

      - Hoặc là click vào đó thì sẽ mua được sản phẩm với những thằng đã click

    - Nên là sẽ quyết định thực hiện theo hướng số 2 đã đề ra

  - Khi mà click vào `checkboxAll` thì tất cả các checkbox con sẽ checked hết, và ngược lại

  - Thì lúc này checkbox chính là giá trị `id` của những sản phẩm mà chúng ta đã chọn

    - Thì chúng ta phải kiểm tra là thằng item product đó đã có check chưa, n ếu mà chưa check thì mới checked nếu đã checked rồi thì bỏ checked đi

    - Để mà `checkedAll` được thì chỗ này chúng ta sẽ lấy ra cái `listAll` những cái item của chúng ta ở đây -> Nó sẽ phụ thuộc vào thằng orderItems của thằng redux ở đây

    - Cách xử lý checkAll là như thế nào -> Thì nó cũng giống như là check thằng checkbox thông thường đầu tiên sẽ kiểm tra là nó đã được checked hết chưa

  - Khi mà nhấn xoá tất cả thì sẽ xoá đi tất cả các `productItem` bên trong `selectedRows`

  - Ở myCart phải làm thêm một cái thằng `state` vì khi mà onChange thì không được xử lý như vậy -> Chỗ onChange tạm thời chúng ta sẽ không đụng tới và sẽ improve sau nên là -> Bây giờ cần hoàn thành những chức năng khác trước

### Xử lý thời gian hết hàng và tạo component no data

- Xử lý thơi gian hết hạn và tạo component no data cho trang web của chúng ta

- Xử lý thời gian hết hàng và tạo component `no-data`

- Bắt đầu sẽ xử lý thời gian hết hàng trước

- Hiện tại thì cái discount đang tính sai vì nó chưa có phụ thuộc vào `ngày hết hạn - discountEndDate` của chúng ta -> Phải checkk xem là ngày hiện tại của chúng ta là có nằm trong `discountStartDate` và `discountEndDate` hay không nếu không thì chúng ta không thể nào apply `discount lên được`

  - Sẽ lấy ra thằng currentItem để xem là nó có hợp lệ hay không

  - Vậy thì khi mà sản phẩm chưa tới hạn giảm giá hoặc là đã hết hạn giảm giá thì chúng ta sẽ không hiển thị ra `discountPercent` và `discountPrice` của sản phẩm đó

### Improve UI cho trang chi tiết sản phẩm và xử lý layout cho trang details

- Improve UI cho trang chi tiết sản phẩm

### Xử lý danh sách sản phẩm liên quan ở trang chi tiết sản phẩm

- XỬ lý danh sách sản phẩm liên quản ở trang chi tiết sản phẩm

- Sẽ lấy ra danh sách sản phẩm có liên quan đến sản phẩm đó, rồi sau đó sẽ render ra màn hình

  - Phải đưa thằng `slug` đang call thằng `productDetails` để lấy ra những sản phẩm có cùng type với nó và sẽ bỏ đi chính thằng sản phẩm đó

- Cái giao diện rối tung cả lên

  - Thì lúc này nó sẽ bị lật qua phía tay trái do cái padding bên ngoài của chúng ta nên là -> Với những thầng spacing thì nó sẽ tự động thêm vào những cái padding

  - fontSize của `description` nhiều khi nó sẽ ăn của thằng editor bên ngoài nên là nhiều khi nó sẽ không ăn

  - DO cái text của chúng ta copy trên mạng và chưa bỏ đi thằng `background` nên là nó có cái nền màu trắng

  - Ok tạm thời sản phẩm của chúng ta là nó sẽ như vậy -> Tạm thời giao diện thì nó sẽ như thế này

  - Sẽ call API `getListRelateProduct` ở trang detailProduct luôn

  - Vậy là đã lấy ra được cái sản phẩm related liên quan dến sản phẩm trong trang chi tiết của chúng ta rồi

  - Sẽ thực hiện filter theo thằng location nữa

  - Không nên gọi API ở bên trong thằng con vì khi mà thằng cha render lại thì thằng call nó lại call API cho dù nó là không cần thiết

  - Nên là chúng ta sẽ `call API` ở ngoài thằng cha

- Thực hiện `onChangeFilterLocation` cho thằng sản phẩm

  - Tất cả các thằng filter đều sẽ chung một hàm là `onChangeFilter` hết

  - Nên là trong cái hàm onChangeFilter, đầu tiên chúng ta sẽ truyền lên e.target.value, sau đó chúng ta truyền thêm type cho nó nữa

  - Lúc này chúng t sẽ truyền thằng object có chứa các filter vào

  - Khi mà có thay đổi thì nó sẽ truyền ra thằng cha và khoogn có khác gì so với thằng filter đầu

  - Chỉ khác là chúng ta cần phải `format` lại thằng `filter` ở trang HOME của chúng ta -> Thì hàm `handleFilterProduct` ở trang `HOME` sẽ phải format lại

  - Khi mà chọn Hà Nội thì nó sẽ filter ra các sản phẩm ở Hà Nội

  - Thêm cái button để mà clear đi filter của chúng ta ở trên sao khi đã chọn cái filter đó

  - Chúng ta sẽ không để cái biến isShowBtnReset nữa mà chúng ta sẽ tách thành 2 biến `locationSelected` và `reviewSelected` như vạy thì mới được

### Thích, bỏ thích sản phẩm

- Thực hiện thích và bỏ thích sản phẩm

- không để cho nó scroll luôn cả nút button của chúng ta nên vì thế chúng ta sẽ không thục hiện cho cái việc scroll nút button `Giỏ hàng`

- Tiếp theo sẽ thực hiện logic cho việc thích hay không thích sản phẩm của chúng ta

- Trong userModel nó sẽ có thằng mảng là `likeProduct` -> Khi mà chúng ta thích thì nó sẽ có ID của sản phẩm đó ở bên trong thằng auth của chúng ta

  - Khi mà người dùng thích thì mình phải lấy thằng user ra và xem là đã có thằng user chưa nếu chưa có thể thì chúng bắt buộc nó phải `Login`

  - Nên đưa lên thằng redux luôn -> Tại vì chúng ta còn phải hiển thị lên `message` và còn phải dùng lại ở nhiều nơi nữa nên là sẽ đưa lên `Redux` để mà lưu trữ và tái sử dụng

    - Tại vì nó còn nằm trong thằng sản phẩm của tôi nữa nên là nên đưa lên Redux là hợp lý nhất

  - user ở hàm handleToggleLikeProduct đã có được thuộc tính likeProduct rồi bây giờ chúng ta sẽ thực hiện gọi API

    - Lúc này sẽ kiểm tra xem sản phẩm của chúng ta nó đã được thích hay chưa

    - Mảng của likedProducts đã bảo gồm productId của sản phẩm đó chưa

    - Đã thực hiện được thích sản phẩm rồi bây giờ sẽ làm gì tiếp theo đây

    - Dùng này sẽ dùng useEffect để mà reload lại giao diện

  - Khi mà likeProduct xong thì phải call tới thằng getAuth để lấy được những thông tin mà chúng ta đã like ở thằng `Product` call tới API `getAuthMe` để lấy ra danh sách sản phẩm đã thích để cập nhật lại trên UI

  - Cho nên là ở chỗ `CardProduct` chúng ta phải xử lý theo một cái cách khác

    - Khi mà người dùng thích xong thì chúng ta cần phải cập nhật lại cái listProduct của chúng ta hoặc là cập nhật lại thằng user ở đây -> Như hiện tại thì cái sản phẩm trả về nó không có thuộc tính là `likedProducts` nên là không thể nào call lại listProduct được

    - Do là chúng ta chưa cập nhật lại thằng auth của chúng ta mà thôii

### Sản phẩm của tôi(đã thích, đã xem)

- Tạo component sản phẩm của tôi, sản phẩm đã thích , sản phẩm đã xem

- Sẽ thêm vào model của product là thuộc tính `likedBy` thì sao khi likeProduct rồi thì sẽ render lại listProduct và kiểm tra `likedBy`

  - Do ở dưới BE 2 thằng objectId so sánh với nhau thì nó sẽ không hiểu nên là cần convert nó sang kiểu `String` thì nó mới có thể hiểu được

  - Khi mà cập nhật lại thằng Auth thì những thằng bên trong thằng nó sẽ render lại thì điều đó nó rất là vô lý -> Đang xử lý sản phẩm mà call `getAuthMe` thì rất là vô lý

  - Do đó trong thằng `listProduct` sẽ chứa `likedBy` -> sẽ chứa `userId` của những người đã thích sản phẩm -> Nên sau khi mà người dùng đã thích sản phẩm thì chỉ cần call lại cái listProduct là được

  - call lại hàm `handleGetListProducts` khi mà Like và Unlike thành công

  - Và ở trong hàm handleToggleLikeProduct thêm một tham số nữa là `isLiked` để check xem là sản phẩm đó user đã thích hay chưa -> Nếu trả về là true thì đã thích rồi

  - `path.MY_PRODUCT` thì chúng ta không cần server side rendering

- Ở trang my-product của chúng ta sẽ có 2 danh sách

  - Cái danh sách thứ nhất đó chính là danh sách những sản phẩm mà chúng ta đã thích -> Có phân trang có limit, page và search -> Quan trọng là có phân trang là được rồi không cần phải search

  - Cái danh sách thứ hai đó chính là danh sách những sản phẩm mà chúng ta đã xem

  - Thì nó chỉ như thế này thôi

- Khi mà chuyển tab thì setSearchBy vẫn chưa bị reset lại

  - Vậy là cái value trong `inputSearch` của chúng ta nó không có ăn được rồi

  - Khi mà chuyển tab thì cái value đã được cập nhật rồi mà cái inputSearch vẫn không cập nhật theo

  - Lúc này thì thằng `search` nó ăn mà thằng `value` thì nó không có cái gì cả

  - Lúc này khi mà search thì cái thằng `searchBy` bên treang `my-product` thì nó vẫn có dữ liệu nhưng mà sau khi truyền qua `inputSearch` thì nó lại không có giá trị gì hết

- Sẽ xử lý xem thằng viewedProducts là nó tính toán như thế nào

  - Khi mà chúng ta getDetails ở bên trong thằng `ProductDetails` thì chúng ta sẽ tăng lượt xem của thằng product đó lên 1 và sẽ tăng vào cái thuộc tính là `viewedProducts` của sản phẩm đó các `idUser` đã xem sản phẩm đó

  - Tạm thời do `getProductsPublic` là lấy sản phẩm mà không có phân quyền cho nên là chỗ xử lý `viewedProducts` khi mà gọi `detailProducts` -> Chúng ta sẽ xử lý sau

- Ở input search khi mà truyền value rỗng vào thì cái inputSearch của mình nó cũng reset theo

  - Cái inputSearch này nó cũng khá là cấn ở chỗ này nên là nên coi thường xuyên hơn

### Xử lý sản phẩm đã xem và refactor luồng authentication của user

- Thực hiện xử lý sản phẩm đã xem và refactor luồng authentication của user

- Do ở trang sản phẩm của tôi là chúng ta đang call API với thằng ProductPublic nên là không thể nào truyền accessToken vào nên không thể lấy ra được số lượng đã xem sản phẩm của người đã xem ra được nên là trang `/product/${slug}` bắt buộc phải truyền vào `userId` nên là phải dùng đến `instanceAxios` -> Nhưng mà theo logic thì nó phải là trang `Public`

- Có 2 hướng để giải quyết vấn đề này là

  - Cách thứ 1 là xử lý ở thằng BE của chúng ta -> Và chúng ta sẽ truyền `UserID` vào thằng API `getProductPublic` của chúng ta

  - Cách thứ 2 là custom lại interceptor ở thằng FE của chúng ta

- Trong thực tế ở dưới API của chúng ta là chúng ta sẽ check xem khi mà một user nào đó nó vào xem trang detail của sản phẩm của chúng ta thì lúc đó chúng ta sẽ tính là thằng user đó đã xem cái sản phẩm đó rồi - Nhưng mà ở trang detail chúng ta đang lấy tới cái API getPublicProducts sản phẩm do là API `public` nên là nó không nhận vào `accessToken` nên là khi đi xuống dưới server thì nó sẽ không đi vào `authPermission` để mà kiểm tra được do đó

  - Nên là ở dưới server nó không có đi vào cái `headers.authorization` và cũng không đi vào `isPublic` nên là nó sẽ bị lỗi

- Ở đây cái API đang là lấy `details` sản phẩm của chúng ta mà lúc này chúng ta lại truyền `userId` vào thì về cái quy tắc thì nó không có hợp lý cho lắm -> Cho nên là chúng ta chỉ nên truyền `slug` hoặc là `idProduct` của sản phẩm vào thôi

  - Thì lúc chúng ta sẽ thêm middleware là `AuthPermission` vào thằng `getDetailProductsPublicBySlug` luôn

- Cái `checkProduct` ở dưới server hiện tại thì nó không có thằng `views` nên là khi là khi += 1 thì nó sẽ không hiểu là gì hết

  - Thì ở dưới server thì cái thằng views chúng ta tắt nó đi, nên là sẽ mở lên là lúc này sẽ có

- Nên là lúc này khi mà chúng ta vào thằng `Sản phẩm của tôi` thì tab `Sản phẩm đã xem` đã có được những sản phẩm đã xem rồi

- Sẽ có danh sách config những cái trang Public để khi mà chúng ta logout ra thì nó sẽ không đá sang trang `login`

  - Sẽ config ở file `auth.ts` những cái đường dẫn mà khi `logout` sẽ không bị đá về trang `login`

- Lúc này chúng ta sẽ xử lý cái luồng như thế này và không đậy tới cái luồng của thằng authGuard nữa

  - Lúc này sẽ bị đá về trang `LOGIN` kèm theo các `asPath` thì nó rất là OK rồi

  - Và trang HOME cũng trang public nên là lúc này cũng sẽ để nó vào danh sách `LIST_PAGE_PUBLIC`

- Lúc này logic của chúng ta xử lý cho những page là public cũng đã khá là ok rồi

  - Nhưng ở đây do trang `/product` user chưa đăng nhập phải cần `accessToken` thì mới call được API vậy nên thì ở đây chúng ta phải xử lý sao khi mà user không login thì chúng ta vẫn cho nó call bình thường

  - Nên là lúc này không có tính là sản phẩm này đã xem Vì lúc này không biết là ai đã đăng nhập đâu mà tính cho nó lượt xem

  - Ở dưới API mình sẽ tính nếu như thằng user truyền userId xuống thì chúng ta sẽ tính còn không sẽ cho nó call bình thường

  - Mặc dù cái API vẫn cho phép chúng ta call bình thường, lúc này nó sẽ không tính tới cái view sản phẩm nữa

  - Thì lúc này chúng ta sẽ xử lý như thế này -> Ở trongg cái config của `interceptor` chúng ta sẽ truyền đi những thông số khi mà chúng ta `callAPI`

  - Nếu như sau này có cái API nào mà ở trạng thái `Public` mà muốn lấy ra được `userId` thì chúng ta có thể sử dụng tới Api đặc biệt ở `interceptor` để mà xử lý

### Xây dựng UI cho trang mua hàng

- Sẽ xây dựng trang UI mua hàng của chúng ta

- Sẽ xử lý thằng mua hàng rồi đăng nhập bằng nextAuth nữa thì sẽ xử lý lại thằng logic phân quyền của trang web

- Phương thức thanh toán trước khi nhận hàng sẽ xử lý với thằng mua hàng, còn các phương thức thanh toán khác sẽ xử lý sau

- Khi mà chọn thì sẽ có `selectedRow` chính là `Id` của thằng sản phẩm của chúng ta

  - Mình sẽ dựa vào thằng `ProductId` này để lấy ra thằng `orderItems` của chúng ta để lấy ra số lượng để mà chúng ta tính toán

  - Sẽ lấy ra tổng sản phẩm được chọn -> Bằng cách lấy ra các IdProduct của nó bằng cách là `map` qua

- Khi mà click vào mua hàng thì chúng ta phải đưa đi tổng số tiền và sản phẩm đó đi theo qua trang `mua hàng` của chúng ta

  - Khi mà checkout product thì chúng ta cần phải đưa đi cái data của chúng ta đi qua trang `checkout-product`

  - Khi mà đưa vào redux thì khi mà chúng ta reload lại thì nó sẽ bị mất đi

  - Sẽ search như thế này `how to add data in router nextjs` -> Cách thứ nhất là đưa với thằng `State`

  - Cách đưa với thằng state thì nó sẽ không có ổn định lắm -> Dùng cách `query` thì nó sẽ ổn đỉnh hơn

    - Ở phía sau `push({}, 'router')` tham số thứ 2 của thằng router dùng để custom router sẽ được xử lý ở một cái `case` khác

- Khi mà ở trang checkout-product và lấy ra thằng query -> Thì ở trong thằng query sẽ chứa các `productSelected` mà chúng ta đã chọn ở trang `my-cart`

  - Thì ở bên trang này rồi thì chúng ta sẽ không lấy từ thắng `selectedRows` vì chúng ta đã có dữ liệu từ thằng `query` rồi

  - Lúc này khi mà log ra sẽ thấy được các thằng item mà chúng ta đã chọn từ bên kia

  - Thì lúc này ở trang checkout-product chỉ cho nó xác nhận lại thằng đã chọn mà thôi

  - Lúc này ở trong component `checkout-product` sẽ không dùng thằng `orderItems` nữa mà sẽ sử dụng thằng `memoQueryProduct`

- Sẽ còn 2 thằng nữa là phương thức thanh toán và phương thức vận chuyển của mình

  - Thì sẽ xử lý phương thức vận chuyển trước rồi sẽ xử lý phương thức thanh toán sau

  - Đưa phương thức thanh toán của chúng ta vào là được -> Thằng phương thức thanh toán nên là radio hay là text bây giờ

    - Sẽ thực hiện lấy method phương thức thanh toán ra

  -

  "dev": "NODE_OPTIONS='--max-http-header-size=12800000' next dev",
  "build": "next build",
  "start": "NODE_OPTIONS='--max-http-header-size=12800000' next start",

- Nếu thằng user mà nó không trọn mà nó vẫn mua hàng được thì nó sẽ bị lỗi

- Khi mà cái query trên đường link URL mà nó quá tải thì chúng ta sẽ có các cách như sau

  - Cách thứ 1 khi mà chuyển sang thằng `checkout-product` thì chúng ta sẽ dùng fakeData từ cái thằng `my-cart` của chúng ta -> Lấy qua những thằng dữ liệu từ `giỏ hàng` của chúng ta

    - Chỗ hàm xử lý `Buy now` khi mà chuyển đi thì chúng ta sẽ tạo ra cái custom `URL` -> Lúc này thì data vẫn sẽ được đưa lên nhưng mà khi reload lại thì cái `query` của chúng ta sẽ không còn

    - Thì lúc này chúng ta cần phải xử lý ở chỗ này

    - Thì khi mà thằng user reload và nhấn vào nút `Mua hàng` của chúng ta -> Thì chỗ này chúng ta sẽ xử lý cái popup nào đó để cho người dùng `back` về lại trang chủ -> Thì cái nayyf chúng ta sẽ xử lý sau

    - Sẽ check lại logic xem mà reload lại có nên cho hiển thị sản phẩm lại hay không

- Thì lúc này sau khi đã có được orderItems từ thằng giỏ hàng rồi -> Thì lúc này chúng ta sẽ Call API để mà `Đặt hàng`

### Integrate API đặt hàng sản phẩm P1

- Nếu như phần đưa dữ liệu của sản phẩm lên trên query của `QueryUrl` ko được thì chúng ta sẽ sử dụng cách khác tạm thời thì nó sẽ là như vậy

- Sẽ cùng nhau xử lý về thằng Call Api thanh toán sản phẩm và phương thức giao hàng

- Khi mà nhấn vào nút mua hàng thì chúng ta sẽ call tới cái `API Đặt hàng`

- Ở đây thì chúng ta đã có được dữ liệu từ đơn hàng rồi nhưng mà vẫn thiếu đó là địa chỉ giao hàng

  - Ở trong API của chúng ta bắt buộc phải nhập paymentMethod, shipping price, items price(tổng tiền sản phẩm của chúng ta chưa cộng phí ship), total Price, fullName , city , address

  - Sẽ có danh sách các địa chỉ giao hàng là một cái array và trong đó sẽ có một thằng gọi là địa chỉ giao hàng mặc định, địa chỉ mặc định để mà chúng ta gửi đi

  - Thì nó sẽ cần nhưng thông tin như là thằng `TParamsCreateOrderProduct` để mà đặt hàng

  - Thì bây giờ cái query đã có được cái totalPrice và `itemProducts` của chúng ta rồi

  - Còn cái địa chỉ giao hàng chúng ta sẽ lấy từ thằng `user` của chúng ta, Cái chỗ thông tin user thì ở trong thằng user nó không có thông tin thì ở đây chúng ta cứ truyền cho nó là một cái string rỗng trước

    - Thì lúc này chúng ta sẽ có thằng address của mình nữa ở trong đó sẽ có nhiều địa chỉ, trong đó sẽ có một cái địa chỉ mặc định để mà chúng ta giao hàng -> Thì cái này chúng ta sẽ xử lý sau

    - thì lúc này cái paymentMethod chính là cái `_idPayment` của phương thức mà chúng ta đã chọn

    - Thì thằng `shipping price` khi mà chúng ta chọn thì làm sao để có thể lấy được cái giá tiền của phương thức giao hàng đó -> Thì ở chỗ `optionDeliveries` chúng ta sẽ thêm vào thuộc tính là price để mà có thể lấy ra được

  - Khi mà chúng ta đặt hàng thì nó sẽ có pending là do nó đang gửi `email` đi để xác nhận đơn hàng, nhưng mà cái case `Email` chỉ khi trong thực tế mới sử dụng vì nó tốn tiền -> Nên là ở trong project này chúng ta sẽ không sử dụng nó

  - Thì sau khi mà đã đặt hàng xong thì chúng ta sẽ lấy đơn hàng đã đặt ra

### Xử lý địa chỉ giao hàng P1

- Thực hiện xử lý địa chỉ giao hàng cho người dùng

- Sau khi đã đặt hàng thành công rồi thì chúng ta sẽ lấy ra các đơn hàng rồi render ra giao diện trang `đơn hàng đã đặt`

- OK bây giờ đã lấy được firstName lastName middleName `_id` từ thằng `getAllOrderOfMe` rồi bây giờ thì chúng ta sẽ thực hiện việc render ra giao diện

- Tiếp tục xử lý tiếp giao diện bên phía FE của chúng ta -> Sẽ tập trung xử lý vào địa chỉ giao hàng

- Sẽ xử lý cái `listData` qua `query` của khi mà chúng ta tiến thành đưa sản phẩm vào để mà thanh toán -> Thì cái query tạm thời là sẽ nh ư vậy -> Khi mà nó reload lại thì nó sẽ mất dữ liệu

- Ở phần chuân bị đặt hàng nếu mà địa chỉ người dùng là chưa có thì chúng ta cần chuẩn bị cho nó một cái popup để mà cập nhật địa chỉ giao hàng cũng như là số điện thoại để mà có thể đặt hàng được

- Ở đây thì người dùng sẽ phụ thuộc vào addresses và cái phoneNumber

  - Cái địa chỉ giao hàng ở đơn hàng thì sẽ không liên quan gì đến địa chỉ của thằng profile của chúng ta

  - Cái địa chỉ và phoneNumber thì chúng ta sẽ validate nó

- Thành phố liên quan đến địa chỉ giao hàng nên là sẽ cho người dùng chọn ở trong trường hợp này

- Sẽ có một cái trạng thái là địa chỉ của tôi sẽ là cái modal khác so với cái modal thêm vào địa chỉ giao hàng -> Cái giao diện đó thì chúng ta sẽ xử lý sau cái `Địa chỉ của tôi` sẽ là một list các cái danh sách địa chỉ của người dùng

### Xử lý logic địa chỉ giao hàng P2

- Thì ở đây chúng ta sẽ chuyển cái UI từ thêm địa chỉ giao hàng qua tới list ra các dah sách địa chỉ giao hàng của tôi

- Ở lần đầu tiên thì mặc định sẽ là địa chỉ giao hàng

- Trong cái Modal địa chỉ giao hàng sẽ hiển thị danh sách các cái sản phẩm của chúng ta ở trong đây -> Và ở trong đó sẽ là cái `listRadio` của chúng ta mà thôi

- Sau khi đã tìm được thằng `addresShipping` để cập nhật địa chỉ giao hàng rồi -> Thì chúng ta sẽ tiến hành cập nhật dịa chỉ

  - Chúng ta sẽ tạo ra một thằng `cloneAddresses`

  - Khi mà cập nhật địa chỉs thì chúng ta sẽ không reset lại thì `isDefault` mà sẽ giữ nguyên cái thằng `isDefault`

- Ok bây giờ thì đã xử lý được `addAddressShipping` và `updateAddressShipping` rồi -> Tiếp theo thì chúng ta sẽ nối API vào trong các thằng này

- Thì ở đây khi mà cập nhật địa chỉ mặc định thì chúng ta sẽ call tới API để cập nhật, còn nảy là cập nhật thông tin địa chỉ cụ thể

- Nếu mà `activeTab === 1` thì chúng ta sẽ xử lý callAPI ở chỗ người dùng

### Hoàn thành xử lý địa chỉ mặc định giao hàng

- Call API để xử lý địa chỉ giao hàng

- Ở đây chúng ta chỉ xử lý khi mà `activeTab === 2` mà thôi, còn các trường hợp khác thì không cần phải xử lý

  - Thì lúc này cái nút cập nhật của chúng ta thì chúng ta sẽ bỏ type là `Submit` cho nó và xử lý sự kiện `onClick` cho nó

  - Sau khi đã có được thông tin địa chỉ rồi thì chúng ta sẽ call tới API là `updateAuthMe` để cập nhật lại thuộc tính là `addresses`

  - Do sử dụng thằng patch nên chỉ có thuộc tính nào cần update thì chúng ta mới để vào thôi

  - Thì chúng ta truyền lên thằng nào thì chúng ta sẽ update thằng đó, nó chỉ `update` những thông tin mà chúng ta truyền lên mà thôi, không có truyền lên thì nó sẽ không có update

  - Hoặc là cách khác là chúng ta chi cần xử ý trên thằng FE của chúng ta mà thôi -> Thì chúng ta sẽ lấy những thông tin của thằng `user` trãi ra rồi ghi đè lại những thằng mà chúng ta thay đổi

  - Sẽ tạo ra một cái API để cập nhật địa chỉ của thằng user không nên call API chung với thằngg `AuthMe`

    - Khi mà callAPI thành công thì chỉ cần `reload` thì nó sẽ có dữ liệu ở trên `server`

  - Bây giờ khi mà chúng ta click vào các `Radio` khác và nhấn address thì sẽ cập nhật địa chỉ mặc định cho chúng ta

    - Thì bây giờ thằng value chính là thằng index của chúng ta -> cho nên chúng ta cũng có thể sẽ không cần biến `addressSelected`

    - Khi mà onChange thì thằng được onChange sẽ có `isDefault` là `true` , tất cả các thằng còn lại sẽ có isDefault là `false`

    - Nên là lúc này chúng ta sẽ giải quyết như thế này

  - Thì lúc này khi mà checked vào thằng address nào thì nó sẽ được lấy là mặc định nên là lúc này chúng ta sẽ lấy thằng address có isDefault là true ->

- Trường hợp là cái listCity của chúng ta nằm trong thằng user và thằng user nằm ở thành phố khác và không nằm trong thằng listCity đó thì nó sẽ bị lỗi -> Khi mà onSubmit thì chúng ta sẽ dùng trực tiếp thằng `data.city` luôn chứ không dùng thằng `findCity` như lúc trước làm nữa

  - Thì lúc này khi mà chọn thành phố thì nó sẽ trả cái `Id` của cái thành phố đó cho nên là chúng ta cần phải convert cái `ID` đó sang `tên` thành phố

  - OK chỗ này đã đặt hàng thành công rồi

  - Bây giờ sẽ tạo ra cái memo

- Thì bên cạnh thằng `payment` và `delivery` thì chúng ta sẽ bổ sung thêm thằng đơn hàng

### Xử lý sản phẩm thông tin đặt hàng với router trong nextjs

### Xử lý giỏ hàng sau khi mua hàng thành công

### Xử lý mua hàng cho sản phẩm

## Quản trị đơn hàng, đơn hàng của tôi

### Xử lý danh sách đơn hàng của tôi

### Xử lý filter theo trạng thái và phân trang trong danh sách đơn hàng

### Xử lý hủy đơn hàng trong đơn hàng của tôi
