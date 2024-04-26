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

  - Tạo ra hàm `convertAddProductToCart` thì mà để chắc chắn thì chúng ta sẽ dùng `try-catch`

    - Đầu tiên là chúng ta nên clone nó ra bằng cách `[...orderItems]` nhưng mà cái vấn đề này nó sẽ sinh ra lỗi thì xíu nữa chúng ta sẽ giải quyết

    - Cái này liên quan đến `immutable` ở trong redux -> Tại vì chúng ta sử dụng trong try-catch nên là khi có lỗi thì nó sẽ trả về lỗi ở bên trong cái `catch` của chúng ta nên là chúng ta sẽ không thấy có lỗi được

      - Thì lúc này chỉ có thể clone được ở cấp đầu tiên của thằng object mà thôi

### Xử lý việc lưu giỏ hàng theo từng user và improve API list sản phẩm

- Khi mà `reload` lại thì vẫn lưu được cái `list` sản phẩm trong cái giỏ hàng của chúng ta

### Cập nhật những thay đổi ở API và xử lý popup giỏ hàng

### Xây dựng UI cho trang giỏ hàng

### Xử lý logic cho trang giỏ hàng

### Xử lý thời gian hết hàng và tạo component no data

### Improve UI cho trang chi tiết sản phẩm và xử lý layout cho trang details

### Xử lý danh sách sản phẩm liên quan ở trang chi tiết sản phẩm

### Thích, bỏ thích sản phẩm

### Sản phẩm của tôi(đã thích, đã xem)

### Xử lý sản phẩm đã xem và refactor luồng authentication của user

### Xây dựng UI cho trang mua hàng

### Integrate API đặt hàng sản phẩm P1

### Xử lý địa chỉ giao hàng P1

### Xử lý logic địa chỉ giao hàng P2

### Hoàn thành xử lý địa chỉ mặc định giao hàng

### Xử lý sản phẩm thông tin đặt hàng với router trong nextjs

### Xử lý giỏ hàng sau khi mua hàng thành công

### Xử lý mua hàng cho sản phẩm

## Quản trị đơn hàng, đơn hàng của tôi

### Xử lý danh sách đơn hàng của tôi

### Xử lý filter theo trạng thái và phân trang trong danh sách đơn hàng

### Xử lý hủy đơn hàng trong đơn hàng của tôi
