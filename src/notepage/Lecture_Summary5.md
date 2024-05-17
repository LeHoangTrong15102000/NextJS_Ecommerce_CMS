# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Quản trị đơn hàng, đơn hàng của tôi

### Xử lý danh sách đơn hàng của tôi

- Thực hiện quản trị đơn hàng của chúng ta

- Lấy ra tất cả đơn hàng của user trong hệ thống qua API là `api/orders/me` và lấy ra `chi tiết` đơn hàng của người dùng cụ thể qua API là `api/orders/me/{orderId}`

- Tạo ra từng cái card riêng, từng cái card sẽ chứa các sản phẩm ở trong đó

  - Trong orderItems sẽ tương ứng với từng sản phẩm ở trong đó

  - Lúc này khi mà chúng ta format đến orderItems của chúng ta

- Sẽ có 3 button xem chi tiết, mua lại sản phẩm ở dưới trong cái giỏ đồ của chúng ta

### Xử lý filter theo trạng thái và phân trang trong danh sách đơn hàng

- Sẽ xử lý `filter` trạng thái và phân trang trong danh sách sản phẩm

### Xử lý hủy đơn hàng trong đơn hàng của tôi

- Đơn hàng phải ở trạng thái là 0 hoặc 1 thì mới có thể hủy được

- Khi mà cancel thành công thì cần phải lấy lại cái list danh sách sản phẩm đặt hàng của chúng ta

### Xử lý mua lại sản phẩm trong đơn hàng cửa tôi P1

- Những cái cardOrder cần đưa cho nó thêm là trạng thái của đơn hàng

- Tạo một thằng config về status về các trạng thái của đơn hàng của chúng ta

- Phần mua lại của chúng ta nó sẽ giống như là phần mua hàng ở trong giỏ hàng của chúng ta vậy

- Khi mà nhấn vào mua lại thì trong cái thằng orderItems thì nó có rất là nhiều thằng

- Thì lúc này cái `listOrderItems` của chúng ta sẽ khác

- Do lúc này selectedRows là có nhưng mà nó vẫn hiển thị button `Mua hàng` là do thằng orderItems từ redux nó không có trả về item được nên là chúng ta không thấy được sản phẩm đó

- Cái phần mua lại đơn hàng hình như nó có vấn đề rồi -> Thì chúng ta sẽ fix cái phần này

### Hoàn thành mua lại sản phẩm

- Lúc này khi mà đã có sản phẩm ở trong giỏ hàng rồi nên khi mà nhấn vòa `Mua lại` thì nó sẽ bị lỗi sản phẩm ở trong giỏ hàng liền -> Sẽ cần phải fix cái vấn đề này thì mới được

  - Để mà debug thì phải check từ cái luồng xử lý đầu tiên của nó -> Khi mà click vào mua lại thì cái luồng xử lý đầu tiên của nó đã là đúng hay chưa

  - Trước khi mà nó push đi thì cái listOrderItem của chúng ta đã là đúng hay chưa

  - Ở đây là chúng ta đang lấy phần tử đầu tiền của `convertUpdateProductToCart` nên là nó đang bị sai logic chỗ này -> Nên là bây giờ chúng ta sẽ chỉnh sửa lại chỗ này

  - Bây giờ sẽ tạo ra hàm là `convertUpdateMultipleProductsCart` để mà `update` nhiều sản phẩm ở đây, cái input chúng ta nhận vào sẽ là `orderItems` và danh sách những cái sản phẩm cần `update`

  - Lúc trước thay vì đưa vào một object TItemOrderProduct để mà xử lý thì lúc này sẽ phải đưa vào cái mảng `TItemOrderProduct[]` để mà xử lý các sản phẩm mua lại

  - Sẽ cần forEach qua cái `addItems` để mà lấy các sản phẩm được add vào cartItem từ button `mua lại`

  - Sẽ phải làm cách đơn giản nhất sau đó chúng ta sẽ tối ưu sau -> Hãy viết code clean sau đó hay nghĩ tới việc clean cộng với performance tốt

  - Hiện tại output xử lý về cái hàm `covertUpdateMultipleProductsCart` đang tương đối là ổn rồi

  - Thì giờ lúc này chúng ta sẽ xử lý tiếp -> Nhưng mà bây giờ thì nó sẽ xảy ra cái vấn đề đó là

  - Ở đây khi mà sản phẩm hết hàng rồi thì không cho phép nó mua lại -> Khi mà sản phẩm hết hàng thì chúng ta sẽ ẩn đi cái nút `mua lại`

    - Cần phải lấy ra được cái `detailProduct` của thằng sản phẩm ở trong `my-order` để có thể cập nhật thông tin của sản phẩm đó

    - Thì lúc này chúng ta sẽ xử lý như thế nào -> Trong từng cardOrder thì sẽ có nhiều sản phẩm

    - Cách đầu tiên Chỉ cần `check` số lượng sản phẩm ở trong thằng my-cart là được không cần phải check trong phần `mua lại` và sẽ cập nhật luôn thầng slug của nó

    - Hoặc là sẽ là cách đơn giản hơn, sẽ là cách trên `FE` trước -> Thì ở component `my-cart` của chúng ta thì orderItems là list sản phẩm của chúng ta -> Nếu như mà ở `orderItems` nó không trả về cho chúng ta `countInStock` và `slug` thì

    - Khi mà chúng ta add vào cái sản phẩm

  - Và hiện tại trong thằng `my-order` của chúng ta là chưa có thằng slug nên là khi nhấn vào xem sản phẩm thì nó sẽ bị lỗi.

    - Do là khi mà logout ra và vào lại thì mình lại lấy từ localStorage ra chứ không cập nhật có cập nhật từ hệ thống thực tế của chúng ta -> Cho nên là nó sẽ sinh ra cái vấn đề là mặc dù số lượng sản phẩm ở trong my-cart vẫn còn nhưng thực tế thì nó đã bị user mua hết rồi.

    - Cho nên là chúng ta không thể nào mà xử lý được bằng cách đưa sản phẩm mình vào(từ trang sản phẩm) cũng như là đưa thằng `slug` vào được -> Nó sẽ tương tự với cái giá tiền của chúng ta trong thực tế -> Trong thực tế thì các traeng web thương mai sẽ sử dụng API để lưu cái card sản phẩm của chúng ta.

    - Hoặc là lúc này chúng ta sẽ cập nhật lại thông tin số lượng khi mà chúng ta vào `my-cart`, nên là chỗ my-cart này chúng ta sẽ cập nhật lại đi

    - Mục đích của việc chuyển ra thành một cái `ItemProductCart` mới là

      - Là có thể chỉnh sửa số lượng còn trong kho `countInStock` và `slug` của sản phẩm

      - Với lại khi mà reload lại trang `giỏ hàng` thì về thằng `slug` và `item` có thể thay đổi theo thời gian.

      - Nên là trong thực tế thì người ta thường lưu cái card sản phẩm ở dưới database luôn, để khi mà có thay đổi gì thì nó sẽ cập nhật lên trên giao diện

      - Tức là cái mặt hàng chúng ta có thể được add vào hôm thứ 2 (ở trong localStorage) -> Cho đến thứ 6 thì nó có thể sẽ bị mua hết hoặc là bị đổi giá hoặc là bị đổi `tên sản phẩm` -> Thì lúc này những thông tin này của chúng ta là cũ -> Cho nên là khi mà chúng ta muốn thông tin chúng ta là mới nhất thì cái chỗ `item(sản phẩm | mỗi món hàng)` thay vì mình lấy từ `localStorage` ra thì chỗ này có thể thay đổi như này, thì thằng `item` có idProduct thì lúc này có thể sử dụng idProduct để call `DetailProduct` được

        - Nhưng mà trong thực tế thì nó sẽ có thằng `API Card` tức là nó sẽ tạo ra thằng card của chúng ta ở database rồi ở trong `my-cart` nó sẽ lấy từ thằng `idCard` của chúng ta thì lúc đó nó sẽ chính xác hơn

        - Nhưng mà cái chúng ta đang lưu ở localStorage nên là cần phải truyền như vậy

    - Lúc này khi mà đã lấy được `getDetailsProduct` rồi cái nhiệm vụ của chúng ta đó sẽ là

      - Tạo ra một thằng state để mà lưu trữ cái `detailsProduct` đó

      - Thì bây giờ thay vì dùng `item` từ ở trên my-cart truyền xuống để mà show ra thì chúng ta sẽ dùng `itemState` để mà show ra đảm bảo các `itemProduct` trong cart là mới nhất

      - Mặc dù khi mà đã tăng số lượng rồi mà thz `amount` nó vẫn lấy từ `state` của chúng ta cho nên là nó không có cập nhật lại được số lượng cho dù thầng redux có thay đổi số lượng

      - Khi mà thằng amount thay đổi thì chúng ta cũng phải check thêm để cập nhật số lượng rồi

    - Sẽ trả thêm về thằng slug ở `getAllOrderOfMe` ở phía server nữa để những thằng sản phẩm ở my-order có thể được click vào để mà chuyển qua trang `product-detail` được

### Fix bug những vấn đề tồn động khi mua lại đơn hàng

- Sẽ fix bug những vấn đề tồn đọng khi mà mua lại đơn hàng

- Thì cái vấn đề đầu tiên đó chính là -> Nếu như cái sản phẩm trong kho chúng ta mua lại mà nó hết hàng thì chúng ta cần phải `disabled` cái nút mua hàng đi

- Cần phải trả về thằng `slug` để khi mà nó add vào trong giỏ hàng của tôi thì nó sẽ trả về cái thz sản phẩm này

- Khi mà nhấn vòa nút mua lại thì chúng ta cần kèm theo thằng `slug` để khi mà nhấn vào thằng sản phẩm trong giỏ hàng thì chúng ta có thể đá nó tới trang `ProductDetail` được

- Lúc này khi mà API đã trả về thằng `countInStock` và thằng `slug` rồi

- Khi mà chúng ta gửi thằng `productOrder` đi ở nút mua lại thì chúng ta cần phải format lại

- Trong thực tế thì cần có những cái API riêng cho những cái card trong giỏ hàng của chúng ta -> Để khi mà có thay đổi về cái thông tin của cái sản phẩm đó thì cái API sẽ tự động cập nhật cho chúng ta -> Nên là chúng ta không cần phải call nhiều API đến như vậy

### Xây dựng trang chi tiết đơn hàng

- Xây dựng trang chi tiết cho những đơn hàng của chúng ta ở trong đơnn hàng sản phẩm

- Khi mà click vào cái `cardOrderProduct` thì sẽ đá đến trang `detailOrderProduct` của chúng ta luôn

- Có một cái button cho nó back về trang `listOrderProduct` của chúng ta -> khi mà click vào button thì sẽ cho phép back về trang danh sách đơn hàng của chúng ta

- Sẽ show nhiều thông tin trong cái chi tiết đơn hàng này hơn nữa

  - Sẽ thêm vào phí giao hàng và phí sản phẩm của chúng ta

  - Sẽ show ra thêm thông tin địa chỉ giao hàng, người nhận hàng

  - Sẽ trả thêm về thông tin city cho người dùng khi mà lúc trước API chỉ có trả về là một cái `_id` của city mà thôi

### Fix bug trang chi tiết đơn hàng và setup cho phần quản trị đơn hàng ở CMS

- Fix bug trang chi tiết sản phẩm của chúng ta

- Sẽ không phân quyền đối với thằng CREATE và VIEW với thằng `order`

### Xây dựng trang quản lí đơn hàng (danh sách và filter)

### Hoàn thành quản trị đơn hàng
