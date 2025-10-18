# 🚀 Mô tả quy trình hoạt động dự án Node.js

Dự án mô phỏng hệ thống mua bán sản phẩm trực tuyến với các chức năng chính.  
Quy trình thực hiện được mô tả theo thứ tự sau:


## 🧩 1. Đăng ký tài khoản (Register)
Người dùng tạo tài khoản mới bằng cách cung cấp thông tin cần thiết.  
Sau khi đăng ký thành công, thông tin người dùng được lưu vào cơ sở dữ liệu.  
![Register](./image/register.png)



## 🔐 2. Đăng nhập hệ thống (Login)
Người dùng sử dụng tài khoản đã đăng ký để đăng nhập.  
Hệ thống kiểm tra thông tin đăng nhập và tạo token xác thực cho phiên làm việc.  
![Login](./image/login.png)



## ✅ 3. Kiểm tra thông tin người dùng (Check)
Sau khi đăng nhập, người dùng có thể kiểm tra thông tin cá nhân hoặc trạng thái tài khoản.  
Chức năng này xác minh token và phản hồi thông tin hợp lệ.  
![Check](./image/check.png)



## ➕ 4. Thêm sản phẩm (Add Product)
Người dùng có quyền thêm sản phẩm mới vào hệ thống.  
Sản phẩm bao gồm các thông tin cơ bản như tên, giá, mô tả và hình ảnh.  
![Add Product](./image/addPrduct.png)



## 💳 5. Mua sản phẩm (Buy Product)
Người dùng chọn sản phẩm muốn mua và tiến hành thanh toán.  
Hệ thống cập nhật đơn hàng và lưu lịch sử giao dịch.  
![Buy Product](./image/buyProduct.png)

---

## 🧠 Tổng kết
Toàn bộ quy trình hoạt động thể hiện luồng người dùng cơ bản trong ứng dụng Node.js:
1. Đăng ký → 2. Đăng nhập → 3. Kiểm tra → 4. Thêm sản phẩm → 5. Mua hàng  
Giúp đảm bảo người dùng có thể thao tác đầy đủ trong hệ thống mua bán trực tuyến.
