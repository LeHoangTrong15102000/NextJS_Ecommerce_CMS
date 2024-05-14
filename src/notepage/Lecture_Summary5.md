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

### Fix bug những vấn đề tồn động khi mua lại đơn hàng

### Xây dựng trang chi tiết đơn hàng

### Fix bug trang chi tiết đơn hàng và setup cho phần quản trị đơn hàng ở CMS

### Xây dựng trang quản lí đơn hàng (danh sách và filter)

### Hoàn thành quản trị đơn hàng
