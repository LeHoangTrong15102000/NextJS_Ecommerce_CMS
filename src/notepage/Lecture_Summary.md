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
