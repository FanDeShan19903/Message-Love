# 💌 Hướng Dẫn Sử Dụng - Digital Love Message

## 📁 Cấu trúc thư mục

```text
love-message/
│
├── index.html       # Trang giao diện chính
├── style.css        # Định dạng giao diện, hiệu ứng Glow & Mobile 9:16
├── script.js        # Hiệu ứng Matrix Code Rain & Giải mã Decrypt
│
└── assets/
    └── music.mp3    # Nhạc nền yêu thích của bạn
```

## 🌐 Cách mở và xem

1. Nhấp đúp chuột vào file `index.html` để mở ngay trên bất kỳ trình duyệt nào:

   * Chrome
   * Safari
   * Microsoft Edge
   * Cốc Cốc
   * Hoặc trình duyệt trên điện thoại

2. Không cần cài đặt thêm phần mềm hoặc server.

## ✨ Cách cá nhân hóa

Để thay đổi **tên người gửi, tên người nhận, ngày đặc biệt và lời nhắn**, hãy mở file:

```text
script.js
```

Ngay phía trên cùng của file, bạn sẽ thấy object `CONFIG`:

```javascript
const CONFIG = {
  senderName: "TÊN ANH",
  receiverName: "LINH",
  specialDate: "23 • 09 • 2026",

  messages: [
    "Anh có một điều muốn nói...",
    "Anh đã suy nghĩ về điều này rất lâu...",
    "Có một người đã khiến những ngày bình thường trở nên đặc biệt.",
    "Anh thích em ❤️",
    "Anh muốn được ở bên em."
  ]
};
```

### 📝 Thay đổi thông tin

Bạn chỉ cần thay đổi các giá trị nằm trong dấu ngoặc kép:

```javascript
senderName: "Tên của bạn",
receiverName: "Tên người ấy",
specialDate: "Ngày đặc biệt",
```

Bạn cũng có thể thay đổi hoặc thêm các câu trong:

```javascript
messages: [
  "Lời nhắn thứ nhất...",
  "Lời nhắn thứ hai...",
  "Lời nhắn thứ ba..."
]
```

Sau khi chỉnh sửa, **lưu file và làm mới trang web** để xem thay đổi.

## 🎵 Thêm nhạc nền

Bạn chỉ cần chép file nhạc `.mp3` yêu thích vào thư mục:

```text
assets/
```

Sau đó đặt tên file thành:

```text
music.mp3
```

Cấu trúc cuối cùng:

```text
love-message/
│
├── index.html
├── style.css
├── script.js
│
└── assets/
    └── music.mp3
```

> 💕 Nếu chưa có file `music.mp3`, website đã tích hợp sẵn hệ thống âm thanh piano lofi êm dịu để tạo không khí lãng mạn.
