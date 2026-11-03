# TikTok LIVE Realtime Analytics Dashboard

Ứng dụng Web Full-Stack theo dõi số liệu thời gian thực (Realtime Analytics) của một kênh TikTok đang phát trực tiếp (LIVE), được xây dựng dựa trên thư viện [`zerodytrash/TikTok-Live-Connector`](https://github.com/zerodytrash/TikTok-Live-Connector).

## Tính năng nổi bật

- **Kết nối trực tiếp TikTok Webcast:** Chỉ cần nhập `@uniqueId` (username của kênh TikTok đang live) để bắt đầu thu thập dữ liệu, không bắt buộc đăng nhập cho phòng live công khai.
- **Chế độ Demo Simulation tích hợp sẵn:** Thử nghiệm ngay lập tức toàn bộ biểu đồ, combo quà tặng và luồng bình luận chỉ với 1 cú nhấp chuột mà không cần đợi kênh thật lên sóng.
- **6 Chỉ số KPI Realtime:**
  - Người xem hiện tại (**CCU**) & Đỉnh người xem (**Peak Viewers**)
  - Tổng lượt **Likes** & tốc độ thả tim/phút
  - Tổng **Diamonds** (Kim cương) & Doanh thu quy đổi ước tính (**USD**), xử lý **chống trùng lặp Gift Streak (`repeatEnd`)**
  - Tổng **Comments** & tốc độ bình luận/phút
  - Lượt **Follow mới** & **Share** trong phiên
  - Lượt người xem bước vào phòng (**Room Joins**) & tốc độ vào phòng/phút
- **Biểu đồ Thời gian thực (Recharts):**
  - Biểu đồ miền biến thiên lượng người xem (CCU)
  - Biểu đồ đường tốc độ tương tác mỗi 10 giây (`Comments/10s`, `Joins/10s`, `Diamonds/10s`)
- **Bảng xếp hạng & Luồng sự kiện:**
  - Bảng xếp hạng **Top 10 Đại Gia (Top Gifters)** & **Top 10 Tương tác (Top Chatters)**
  - Luồng quà tặng trực tiếp hiển thị trạng thái **COMBO** / **FINAL**
  - Luồng bình luận trực tiếp tích hợp **Bộ lọc câu hỏi mua hàng (`?`, `giá`, `mua`, `ship`...)** và xuất báo cáo JSON.

## Cách chạy ứng dụng

### Chạy đồng thời cả Backend & Frontend
```bash
npm run dev
```

Hoặc chạy riêng trên 2 cửa sổ terminal:
```bash
# Terminal 1 - Backend (Port 3001)
npm run dev:backend

# Terminal 2 - Frontend (Port 5173)
npm run dev:frontend
```

Sau đó mở trình duyệt tại địa chỉ: **`http://localhost:5173`**
