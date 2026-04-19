# FoodieGen - AI Marketing Video Generator for Foodies

**FoodieGen** là ứng dụng desktop mạnh mẽ giúp tự động hóa quy trình sáng tạo video marketing chuyên nghiệp cho ngành ẩm thực. Với sự kết hợp của các công nghệ AI tiên tiến nhất, FoodieGen cho phép bạn biến một ý tưởng thô thành một video cinematic chất lượng cao chỉ trong vài phút.

> **[Tải xuống ứng dụng tại đây.](https://github.com/BlankBire/FoodieGen/releases/download/v0.1.0/FoodieGenSetup.exe)**

---

## Tính năng nổi bật

- **AI Scriptwriting (Google Gemini)**: Tự động "thông não" và trau chuốt kịch bản từ ý tưởng thô sơ thành kịch bản Cinematic chuẩn chuyên nghiệp với các từ khóa kỹ thuật quay phim tinh tế.
- **Cinematic Video Gen (RunwayML Gen-3)**: Chuyển đổi kịch bản hình ảnh thành những phân cảnh video chân thực, sống động, tập trung vào độ chi tiết của món ăn và chuyển động của nhân vật.
- **Natural Voiceover (FPT.AI)**: Tích hợp giọng đọc AI tiếng Việt tự nhiên nhất thị trường, mang lại cảm xúc và độ chân thực cho từng câu thoại.
- **Electron Standalone Architecture**: Chạy mượt mà trên Windows dưới dạng ứng dụng độc lập, tích hợp sẵn database SQLite cục bộ để bảo mật và quản lý dự án hiệu quả.
- **Siêu nhẹ & Tối ưu**: Bộ cài được tinh chỉnh chỉ ~230MB, đã bao gồm đầy đủ engine Prisma và các dependencies cần thiết.

---

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React, TailwindCSS, Lucide Icons.
- **Backend (Sidecar)**: Next.js Standalone Server (API).
- **Desktop Shell**: Electron JS.
- **Database**: SQLite & Prisma ORM.
- **AI Integration**: Google GenAI (Gemini), RunwayML SDK, FPT.AI API.

---

## Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js v18 trở lên.
- Windows 10/11 (Để build bản executable).

### Triển khai môi trường lập trình
1. **Clone dự án**:
   ```bash
   git clone https://github.com/BlankBire/FoodieGen.git
   cd FoodieGen
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**:
   - Copy file mẫu: `cp src/api/.env.example src/api/.env`
   - Điền các API Key của bạn (Google, RunwayML, FPT.AI) vào file `.env` mới tạo.

4. **Chạy ở chế độ Development**:
   ```bash
   npm run electron:dev
   ```

---

## Đóng gói ứng dụng

Để tạo bản cài đặt `.exe` cho Windows, hãy chạy lệnh:

```bash
npm run electron:build
```

Sau khi hoàn tất, file cài đặt sẽ nằm trong thư mục `dist/FoodieGen Setup 0.1.0.exe`. Bản build này đã được tối ưu hóa dung lượng và tích hợp sẵn quy trình tự động khởi tạo Database.

---

## Cấu trúc dự án

```text
├── electron/           # Code chính của Electron (Main & Preload)
├── src/
│   ├── api/            # Backend (Next.js Standalone - Sidecar)
│   └── web/            # Frontend (Next.js UI)
├── scripts/            # Các script tối ưu hóa build & binary
├── bin/msvc/           # Thư mục chứa các file hệ thống bổ trợ (DLLs, Template DB)
└── package.json        # Cấu hình mono-repo & build scripts
```

---

## Đóng góp

Mọi ý kiến đóng góp hoặc báo lỗi vui lòng mở Issue hoặc gửi Pull Request. FoodieGen luôn chào đón cộng đồng cùng phát triển để mang lại công cụ tốt nhất cho người làm nội dung ẩm thực!

---

## Giấy phép

Dự án này thuộc sở hữu của **BlankBire**. Vui lòng liên hệ tác giả trước khi sử dụng cho mục đích thương mại.