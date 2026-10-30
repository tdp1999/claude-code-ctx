<!-- format: 2 -->
# Checklist size S

Size S dành cho việc nhỏ: nguyên nhân rõ, chỉ chạm một chỗ, và đảo ngược dễ. Ví dụ: sửa chữ, sửa một bug đã biết chỗ hỏng, đổi một config.

Nâng size ngay nếu trong lúc làm gặp một dấu hiệu của size M hoặc L (tra A). Đừng cố làm cho xong ở size S.

Tiêu đề mỗi phase có dạng "tên phase | role ngoài thực tế thường làm việc này". Role giúp Owner đổi góc nhìn khi vào phase.

Dòng "Đầu ra" nói phase đó để lại gì, và ghi vào đâu. Mã E1 đến E7 là các phần của epic. Mỗi mã thuộc đúng một phase. E0 là bảng câu hỏi của epic, dùng ở mọi phase. T1 đến T6 là các phần của task, theo template của plugin ctx.

Vai trò (gọi theo góc nhìn người ngoài):

- Owner: người làm chủ ticket (con người).
- Claude: Claude trong session đang làm việc.
- Claude, session mới: Claude ở context sạch, không thấy quá trình làm ra sản phẩm.
- Codex: một model khác (ChatGPT qua plugin codex), context sạch, chỉ nhận context packet.
- Máy: test, lint, type check, build.
- Người đưa vấn đề: CS, BA hoặc Manager.
- Manager, Tester, Người nghiệm thu UAT.

Dòng "Ai làm" dùng một trong các mẫu sau:

- Claude soạn; Owner chốt: Claude làm bản nháp, Owner quyết.
- Owner trước; Claude kiểm tra: Owner tự nghĩ trước, vì chỗ này dễ bị anchoring.
- Owner: chỉ Owner làm được, ví dụ nói chuyện với người khác, thử app bằng tay, duyệt.
- Máy: test, lint, build.

Cách đọc một item:

- Mỗi item có SN, title, một câu description, rồi content dạng list.
- Item không có dòng "Ai làm" là tên nhóm. Các item con của nhóm nằm ngay dưới nó.
- Dòng "Claude:" nghĩa là Claude có hướng dẫn riêng cho item này trong playbook. Owner không cần đọc playbook.
- "Ai kiểm: —" nghĩa là việc đó chưa có ai kiểm, và Owner chấp nhận điều đó một cách có chủ ý.
- "tra X" chỉ sang mục X của `lookup.md`, nơi có cách làm.
- "📁 §N" nghĩa là item đó cần dữ liệu riêng của project. Mở mục N trong hồ sơ project (`.context/checklist-profile.md`), dùng cái đã có, và ghi thêm cái mới phát hiện.

## 1. Problem Discovery | Business Analyst

**Qua phase khi:** Owner nói được vấn đề và kết quả mong muốn trong một câu.

**Đầu ra:** không có file. Câu vấn đề nằm trong mô tả của commit hoặc PR.

### 1.1 Viết vấn đề trong một câu
Ai làm: Owner · Ai kiểm: Người đưa vấn đề (chỉ khi Owner hỏi)

Owner viết vấn đề và kết quả mong muốn trong một câu.

- Nếu chưa chắc, Owner hỏi người đưa vấn đề một câu.

## 5. Implementation | Developer

**Qua phase khi:** Máy báo mọi check đều xanh.

**Đầu ra:** code và test, vào commit.

### 5.1 Tái hiện bug bằng một test đỏ
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner xem test đỏ

Nếu ticket là bug, viết một test đỏ tái hiện bug trước khi sửa.

Ref: tra E

### 5.2 Chạy check của máy
Ai làm: Máy · Ai kiểm: Owner xem output

Máy chạy type check, lint, test và build.

Ref: 📁 §7

## 6. Testing | Tester

**Qua phase khi:** Owner xác nhận chỗ vừa sửa chạy đúng.

**Đầu ra:** không cần ghi riêng. Owner xác nhận trong PR.

### 6.1 Đọc diff nguội
Ai làm: Owner · Ai kiểm: —

Owner đọc diff khi đầu óc đã nguội và giải thích được từng dòng.

- Dòng nào chưa giải thích được thì chưa merge.
- Tìm cả những thay đổi không liên quan tới task.

Ref: tra D

### 6.2 Tự kiểm 4 lớp trên app thật

Owner kiểm theo thứ tự, và nếu lớp trước hỏng thì chưa sang lớp sau.

#### 6.2a Chạy đường hạnh phúc (lớp 1)
Ai làm: Owner · Ai kiểm: —

Owner chạy đúng chỗ vừa sửa bằng tay, như người dùng thật.

- Lớp này không phải là "unit test pass".

#### 6.2b Thử edge case (lớp 2)
Ai làm: Owner · Ai kiểm: —

Owner thử ít nhất 3 edge case, chọn từ danh sách chung ở tra F và danh sách riêng của project.

- Xem cả màn hình lỗi, màn hình rỗng và lúc đang tải.

Ref: tra F, 📁 §3

#### 6.2c Kiểm hồi quy quanh chỗ sửa (lớp 3)
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —
Claude: ⚙ 6.2c

Owner mở thử ít nhất một chỗ dùng chung hàm, component hoặc endpoint vừa sửa.

- Claude tìm sẵn danh sách những chỗ dùng chung đó.

Ref: 📁 §6

#### 6.2d Thử với dữ liệu thật (lớp 4)
Ai làm: Owner · Ai kiểm: —

Owner thử với dữ liệu cũ, dữ liệu bẩn, thiếu field hoặc sai format.

- Không dùng seed sạch.

Ref: 📁 §3, §6

## 7. Release | Release Manager

**Qua phase khi:** smoke test ở PROD đã qua.

**Đầu ra:** không cần ghi riêng. Một câu báo lại người đưa vấn đề là đủ.

### 7.1 Đưa lên từng môi trường
Ai làm: Owner · Ai kiểm: Người nghiệm thu UAT (nếu team yêu cầu)

Owner đưa lên SIT, rồi UAT, rồi PROD theo quy trình môi trường của team.

- Smoke test chỗ vừa sửa ở mỗi môi trường.

Ref: 📁 §8

### 7.2 Báo lại người đưa vấn đề
Ai làm: Owner · Ai kiểm: —

Owner báo lại người đưa vấn đề trong một câu.

---

Gặp bug ở bất kỳ phase nào: xem tra E.
