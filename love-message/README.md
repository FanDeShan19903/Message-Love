# Hướng Dẫn Sử Dụng - Digital Love Message

## Cấu trúc thư mục:
```text
love-message/
│
├── index.html       (Trang giao diện chính)
├── style.css        (Định dạng giao diện, hiệu ứng glow & mobile 9:16)
├── script.js        (Hiệu ứng Matrix Code Rain & Giải mã Decrypt)
│
└── assets/
    └── music.mp3    (Nhạc nền yêu thích của bạn)
```

## Cách mở và xem:
1. Nhấp đúp chuột vào file `index.html` để mở ngay trên bất kỳ trình duyệt nào (Chrome, Safari, Edge, Cốc Cốc) hoặc trên điện thoại.
2. Không cần cài đặt bất kỳ phần mềm hay server nào.

## Cách cá nhân hóa (Đổi tên & lời nhắn):
Mở file `script.js`, ngay trên cùng bạn sẽ thấy object `CONFIG`:

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

Chỉ cần thay đổi các giá trị trong dấu ngoặc kép theo ý bạn, lưu lại và làm mới trang web!

## Thêm nhạc nền:
- Bạn chỉ cần chép file nhạc mp3 yêu thích vào thư mục `assets/` và đặt tên là `music.mp3`.
- Nếu chưa có file `music.mp3`, website đã tích hợp sẵn hệ thống âm thanh piano lofi êm dịu tạo cảm giác lãng mạn ngay lập tức.
