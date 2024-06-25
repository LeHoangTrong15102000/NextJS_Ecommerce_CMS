# Khóa học NextJS 14 - Typescript thực chiến Pro 2024

## Quản lý đánh giá sản phẩm

### Fix bug đơn hàng và setup review

- Thực hiện quản trị đánh giá cho sản phẩm

- Trong thằng review sẽ trả về cho chúng ta thông tin của thằng user đã đánh giá sản phẩm

- Trước khi mà fix bug đơn hàng và setup review cho đơn hàng của chúng ta thì chúng ta sẽ thực hiện các việc như sau

### Hoàn thành quản trị đánh giá ở CMS

- Xây dựng CRUD cho trang đánh giá sản phẩm ở trang quản trị của chúng ta

- Còn cái bộ lọc xử lý thì chúng ta sẽ xử lý nó sau

  - Còn cái sản phẩm và người dùng đánh giá sản phẩm đó thì chúng ta không thể edit được

- Ở dây thì chúng ta sẽ không th ể nào mà sử dụng được cái hàm đó ở đây mà chúng ta sẽ cần phải bổ sung nó sau nên là chúng ta cần phả thực hiện

- Việc thực hiện cái này là phải phụ thuộc vào nhiều cái vấn đề nữa chứ nó không đơn giản như là mọi ng ười thường hay nghĩ đâu nên là chúng ta cần phải hết sức cẩn thận

- Sử dụng full outer join khi mà ch úng ta muốn giữu lại data của cả 2 bảng -> Nên là do vậy thì chúng ta chỉ cần sử dụng left Join hoạc là right Join

- Tương ứng với từng sản phẩm ở bên trong thì chúng ta cần cho cái button để mà user viết cái review tới những sản phẩm của chúng ta

### Viết đánh giá cho sản phẩm

-

### Hoàn thành danh sách đánh giá của chi tiết sản phẩm

- Khi maf vào danh sách chi tiết của một cái sản phẩm sẽ hiển thị cái danh sách các cái `đánh giá` của chúng ta

- Và trong đây thì thằng user có thể `edit` và `delete` cái review của chính nó

- Sẽ lấy ra từng cái `review` tương ứng với từng sản phẩm của chúng ta

- Sẽ có cái là `getAllReviews` sẽ không có lấy thằng `reviewMe` nữa -> Chúng ta sẽ thêm filter vào trong trang `detailProduct` để mà lấy dựa trên `slugProduct` của thằng sản phẩm đó

- Do thằng `getAllReviews` nó lọc cái review dựa trên `productId` chứ không phải là slug nên là chúng ta cần phải đưa vào là `productId`

- Chúng ta sẽ `sort()` theo những cái review nào mà mới nhất thì ở đây chúng ta phân trang cũng được -> Nhưng mà ở đâyy chúng ta sẽ không có phân trang nó

- Khi mà đã lấy được API public rồi thì chúng ta sẽ không cần tới `instanceAxios` nữa

- Đó sẽ là cách mà chúng ta sẽ xử lý responsive ở trong `component`

- Tiếp theo sẽ xử lý `edit` và `delete` cho phần review sản phẩm

- Thì cái chỗ getDetailReview thì lúc này chúng ta phải chắc chắn là nó đã login rồi thì chúng ta mới hiển thị `button edit`

- Chúng ta sẽ update là `UpdateMyPreviewAsync` còn `UpdateReviewAsync` thì thằng admin phải vào trong system để mà update

### Hoàn thiện luồng phân quyền cho hệ thống

- Thì lúc này chúng ta cần phải thay đổi một tí là từ `/` phải thay đổi thành `/home` để nó mới có thể phù hợp với cái logic của chúng ta được

- Nên là lúc này khi mà nó vào trang `/` thì chúng ta phải đá nó về trang `/home` -> Thì khi mà truy cập vào trang web thì tất cả `authGuard` `guestGuard` bằng true hay false thì nó đều chạy vào thằng `AclGuard(khiên phân quyền)`

- Thì ở trong đây chúng ta sẽ sử dụng useEffect để mà checkRoute của người dùng -> Nếu mà người dùng vào `route` `/` thì đá về `/home` -> Sẽ phụ thuộc vào `auth.user` xem là thằng này nó đã login hay chưa

- Tất cả các trang của chúng ta đều đi vào thằng `AclGuard`

- Do thằng sản phẩm chúng ta có productPublic nên là chúng ta không cần phải phân quyền `VIEW` đối với thàngw sản phẩm
