# Hồ sơ project: <tên>

File này (`.context/checklist-profile.md`) chứa dữ liệu riêng của một project: những câu trả lời đã biết. Luật chung nằm ở checklist và `lookup.md`, không chép lại ở đây.
Checklist trỏ tới đây bằng dấu "📁 §N". Lớn dần theo ticket: phát hiện điều mới thì ghi thêm một dòng. Điều gì gặp lại ở project thứ hai thì đưa lên file evergreen.

## 1. Người dùng và bối cảnh sử dụng

| Ai | Ở đâu, thiết bị gì | Tay có rảnh không, mạng có ổn không | Hệ quả cho thiết kế |
| --- | --- | --- | --- |

## 2. Hôm nay họ làm thế nào

Cách làm hiện tại (kể cả Excel, gọi điện) và ràng buộc nó lộ ra.

## 3. Danh sách edge case riêng

Bổ sung cho danh sách chung ở tra F.

## 4. Câu hỏi hay phải hỏi (và ai trả lời)

Câu hỏi mà gần như ticket nào cũng phải hỏi, kèm người trả lời được. Chỉ giữ câu có câu trả lời đổi theo từng ticket; câu nào đã có câu trả lời ổn định thì chuyển câu trả lời sang mục tương ứng và xóa câu hỏi ở đây.

## 5. NFR mặc định và ràng buộc

Performance, bảo mật, phân quyền, compliance, accessibility mà mọi ticket đều phải tính.

## 6. Phụ thuộc mà code không cho thấy

Ai và cái gì đang dựa vào hệ thống này mà đọc code không thấy: client và phiên bản đang chạy, integration bên ngoài, báo cáo và export, cấu hình riêng của từng khách, dữ liệu lịch sử.

## 7. Cách làm kỹ thuật

Stack, lệnh check (type, lint, test, build), cách test và công cụ, design system và khi nào gọi designer.

## 8. Môi trường, release, rollback, monitoring

Các môi trường, cách deploy, cơ chế rollback và feature flag, xem log và chỉ số ở đâu. Sau release theo dõi bao nhiêu ngày (size M, size L).

## 9. Người liên quan và từ vựng domain

| Ai | Vai trò trong workflow (người đưa vấn đề, người duyệt, người nghiệm thu UAT, tester) |
| --- | --- |

| Từ | Nghĩa trong project này |
| --- | --- |

## 10. Tài liệu nằm ở đâu

Decision note, design doc, as-built doc, ticket.
