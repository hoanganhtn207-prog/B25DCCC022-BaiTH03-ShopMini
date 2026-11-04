# ShopMini

Ứng dụng cửa hàng mini xây dựng bằng **React + TypeScript (Vite)**, quản lý state toàn cục bằng **Context API** và **Redux Toolkit**.

## Chạy dự án

```bash
npm install
npm run dev      # chạy môi trường phát triển
npm run build    # kiểm tra kiểu TypeScript và build
```

Đăng nhập thử nghiệm: tên đăng nhập bất kỳ, mật khẩu `123456`.

## Các trang

| Đường dẫn | Trang | Ghi chú |
|---|---|---|
| `/` | Trang chủ | Lưới sản phẩm 1/2/4 cột, tìm kiếm theo tên |
| `/products/:id` | Chi tiết sản phẩm | Mở thẳng URL vẫn tự tải dữ liệu |
| `/cart` | Giỏ hàng | Tăng/giảm/nhập số lượng, xoá, xoá toàn bộ |
| `/login` | Đăng nhập | Quay lại trang trước đó sau khi đăng nhập |
| `/checkout` | Thanh toán | **Protected route** |
| `*` | 404 | |

## Dữ liệu nằm ở đâu và vì sao

| Dữ liệu | Nơi lưu | Lý do |
|---|---|---|
| `theme` (sáng/tối), `toggleTheme` | **Context** (`ThemeContext`) | Nhiều component cần đọc (toàn bộ giao diện), ít thay đổi, logic đơn giản, không cần middleware hay selector phức tạp. |
| `user`, `login`, `logout` | **Context** (`AuthContext`) | Là trạng thái phiên đăng nhập dùng ở Header, ProtectedRoute, LoginPage; thay đổi hiếm; không phải dữ liệu nghiệp vụ. |
| Danh sách sản phẩm + `status` (idle/loading/succeeded/failed) + `error` | **Redux** (`productsSlice`) | Dữ liệu từ API dùng ở nhiều trang (trang chủ, chi tiết); cần quản lý bất đồng bộ bằng `createAsyncThunk` và 3 trạng thái tải; tải một lần rồi dùng lại. |
| Giỏ hàng (`items`), tổng số lượng, tổng tiền | **Redux** (`cartSlice`) | Nhiều nơi đọc/ghi (Header, ProductCard, trang chi tiết, giỏ hàng, thanh toán); có nhiều action cập nhật; tổng được tính bằng selector có memo (`createSelector`) nên không lưu trùng lặp. |
| Từ khoá tìm kiếm | **useState** (`HomePage`) | Chỉ trang chủ dùng, mất đi khi rời trang cũng không sao; đưa lên global là không cần thiết. |
| Giá trị ô username/password, thông báo lỗi, trạng thái đang gửi | **useState** (`LoginPage`) | Là state của form, chỉ tồn tại trong một component. |
| Cờ `ordered` (đã đặt hàng) | **useState** (`CheckoutPage`) | Chỉ dùng để hiện thông báo thành công ở trang thanh toán. |

Nguyên tắc chọn: state chỉ một component cần → `useState`; state chung, ít đổi, mang tính cấu hình/phiên → Context; state chung, đổi thường xuyên, có logic nghiệp vụ hoặc bất đồng bộ → Redux Toolkit.

Ngoài ra `theme` và tên người dùng được lưu vào `localStorage` để giữ lại sau khi tải lại trang.

## Cấu trúc thư mục

Theo đúng cấu trúc gợi ý của đề bài (`app/`, `features/`, `contexts/`, `components/`, `layouts/`, `pages/`, `types/`); thêm `src/utils.ts` chứa hàm định dạng giá.
