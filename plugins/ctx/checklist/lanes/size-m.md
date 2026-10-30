<!-- format: 2 -->
# Checklist size M

Size M là size mặc định: ticket không đủ nhỏ cho size S, và không có dấu hiệu nào của size L. Cách chọn size ở tra A. Ghi dòng "Size: M · vì …" ngay dưới tiêu đề task.

Tiêu đề mỗi phase có dạng "tên phase | role ngoài thực tế thường làm việc này". Role giúp Owner đổi góc nhìn khi vào phase.

Dòng "Đầu ra" nói phase đó để lại gì, và ghi vào file nào. Mã E1 đến E7 là các phần của epic. Mỗi mã thuộc đúng một phase. E0 là bảng câu hỏi của epic, dùng ở mọi phase. T1 đến T6 là các phần của task, theo template của plugin ctx.

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

"⚙ review" nghĩa là Claude ở session mới và Codex review độc lập, rồi Owner lọc finding. Cách làm ở tra I.

"⚙ review-round" nghĩa là sau khi Claude sinh xong code hoặc test, một subagent và Codex review song song theo skill `review-round`. Claude kiểm tra và sửa các finding. Owner chỉ chốt các quyết định ở mức sản phẩm. Cách làm ở tra K.

Cách đọc một item:

- Mỗi item có SN, title, một câu description, rồi content dạng list.
- Item không có dòng "Ai làm" là tên nhóm. Các item con của nhóm nằm ngay dưới nó.
- Dòng "Claude:" nghĩa là Claude có hướng dẫn riêng cho item này trong playbook. Owner không cần đọc playbook.
- "Ai kiểm: —" nghĩa là việc đó chưa có ai kiểm, và Owner chấp nhận điều đó một cách có chủ ý.
- "tra X" chỉ sang mục X của `lookup.md`, nơi có cách làm.
- "📁 §N" nghĩa là item đó cần dữ liệu riêng của project. Mở mục N trong hồ sơ project (`.context/checklist-profile.md`), dùng cái đã có, và ghi thêm cái mới phát hiện.

## 1. Problem Discovery | Business Analyst

**Qua phase khi:** người đưa vấn đề xác nhận Owner đã hiểu đúng vấn đề.

**Đầu ra:** vấn đề, "xong" kèm con số hiện tại, phạm vi và edge case. Ghi vào mục Problem của task. Câu hỏi và câu trả lời ghi vào mục Questions.

### 1.1 Hỏi người đưa vấn đề trong buổi brief
Ai làm: Owner · Ai kiểm: Người đưa vấn đề

Owner hỏi người đưa vấn đề bộ câu hỏi chung ở tra G, phần G1.

- Mở đầu bằng câu "Vấn đề bạn đang thấy là gì?".
- Owner hỏi thêm những câu mình tự nghĩ ra.
- Owner ghi nguyên văn lời người đưa vấn đề.

Ref: tra G, 📁 §1, §2

### 1.2 Tự phân tích vấn đề
Ai làm: Owner trước; Claude kiểm tra · Ai kiểm: Owner đọc lại bản Claude viết
Claude: ⚙ 1.2

Owner viết trước một bản phân tích gồm các mục dưới đây, rồi Claude kiểm tra.

- Vấn đề, viết theo lời Owner.
- Tình huống dùng (JTBD): mọi lúc người dùng mở tính năng này. Mỗi tình huống là một câu "Khi …, tôi muốn …, để …", và ghi rõ "Trong phạm vi" hay "Ngoài phạm vi".
- Những gì trong phạm vi và ngoài phạm vi.
- Edge case của từng tình huống, tìm bằng phép thử tờ giấy 📁 §3
- Câu hỏi về nhu cầu 📁 §4
- Các giả định.
- Đầu ra: Claude ghi bản đã chốt vào mục Problem và Questions của task.

Ref: tra F, tra G

### 1.3 Viết "xong" thành một câu quan sát được
Ai làm: Owner trước; Claude kiểm tra · Ai kiểm: Người đưa vấn đề

"Xong" là một câu quan sát được về người dùng, không phải "màn hình chạy được".

- Câu này kèm thước đo và con số hiện tại, để phase 8 có cái so sánh.

### 1.4 Gửi vòng confirm
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Người đưa vấn đề trả lời

Owner gửi mỗi người đưa vấn đề một tin nhắn gồm các mục dưới đây.

- Các giả định, để họ trả lời đúng hay sai.
- Những câu hỏi về nhu cầu mà họ trả lời được.
- Những quyết định ảnh hưởng tới họ, viết thành đề xuất có lựa chọn.
- Một mặc định cho từng câu, dùng khi họ không phản hồi.
- Trước khi gửi, Owner lọc: tự trả lời những câu mình biết và bỏ những đề xuất sai.
- Câu trả lời ghi vào mục Questions.

Ref: tra G

## 2. Solution Design | Solution Architect

**Qua phase khi:** Owner đã chọn phương án và ghi lý do.

**Đầu ra:** phương án đã chọn kèm lý do của Owner, blast radius, rabbit hole và appetite. Ghi vào mục Approach của task.

### 2.1 So sánh các phương án
Ai làm: Claude soạn; Owner chốt · Ai kiểm: ⚙ review: tìm điểm yếu
Claude: ⚙ 2.1

Có ít nhất hai phương án, và Owner chọn một rồi ghi lý do chọn (decision note).

- Ít nhất một phương án phải khác hẳn mẫu đang có trong code.
- Nếu UI quyết định phương án, mỗi phương án kèm một phác thảo màn hình chính.
- Bản nháp ghi nguồn research bên ngoài (pattern, sản phẩm tương tự) và tiền lệ trong code.

Ref: tra I

### 2.2 Liệt kê blast radius và tương thích
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Liệt kê những gì bị ảnh hưởng khi thay đổi.

- Trong code: chỗ nào gọi hoặc đọc phần bị đổi.
- Ngoài code: client cũ, integration, báo cáo và export, cấu hình riêng của khách. Owner bổ sung phần này.

Ref: 📁 §6

### 2.3 Chặn rabbit hole và ghi appetite
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —

Liệt kê những chỗ dễ sa lầy và cách chặn trước.

- Gồm cả edge case do chính phương án này sinh ra: cache, đồng bộ, migration, giới hạn của thư viện.
- Quét danh sách edge case của hệ thống ở tra F.
- Ghi appetite: làm trong bao lâu. Nếu vượt appetite thì cắt phạm vi.

Ref: tra F

## 3. Flow & Prototype | UI/UX Designer + Business Analyst

**Qua phase khi:** Manager đồng ý với flow, danh sách màn hình và mockup, và mỗi mục "Trong phạm vi" đã có ít nhất một flow.

**Đầu ra:** flow, danh sách màn hình, data dictionary, link mockup kèm đủ trạng thái. Ghi vào mục Approach của task.

Phase này áp dụng cho mọi loại ticket: tính năng mới, nâng cấp hoặc refactor, sửa bug. Mỗi loại làm khác nhau. Cách làm ở tra J, phần J1. Ticket không có UI vẫn viết flow (các bước của hệ thống) và danh sách endpoint hoặc event, chỉ bỏ các item về mockup.

### 3.1 Viết flow
Ai làm: Claude soạn; Owner chốt · Ai kiểm: ⚙ review: tìm bước và nhánh rẽ còn thiếu

Mỗi việc mà người dùng hoặc hệ thống làm là một flow có mã (F1, F2).

- Mỗi flow gồm các bước đánh số của đường chính.
- Mỗi bước có các nhánh rẽ: lỗi, thiếu dữ liệu, hủy, hết phiên, không có quyền.

Ref: tra J, 📁 §1

### 3.2 Lập danh sách màn hình
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Mỗi màn hình, hộp thoại, trang lỗi, email và thông báo có một mã (S1, S2).

- Mỗi mã ghi những flow nào đi qua nó.

Ref: tra J

### 3.3 Viết data dictionary
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Mỗi field mới hoặc bị đổi ghi nghĩa, kiểu, định dạng, ví dụ, có bắt buộc hay không, giới hạn và nhãn hiển thị.

- Mỗi giá trị của enum có nhãn riêng.

Ref: tra J

### 3.4 Vẽ bảng và sơ đồ bổ sung
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Manager

Chọn bảng và sơ đồ theo hệ thống.

- Nếu hệ thống có nhiều role, vẽ ma trận phân quyền.
- Nếu entity có vòng đời, vẽ sơ đồ trạng thái.
- Nếu có nhiều hệ thống, vẽ thứ tự gọi giữa các hệ thống.

Ref: tra J, 📁 §5, §6

### 3.5 Chọn người thiết kế
Ai làm: Owner · Ai kiểm: —

Nếu design system đủ dùng, Owner tự thiết kế.

- Nếu không đủ, Owner gọi designer.

Ref: 📁 §7

### 3.6 Làm mockup
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Manager

Làm mockup hoặc demo bấm được, phủ mọi màn hình ở 3.2.

- Owner present rồi ghi lại feedback.

### 3.7 Vẽ đủ trạng thái màn hình
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Manager

Mỗi màn hình có đủ các trạng thái áp dụng.

- Mỗi trạng thái có câu chữ hiện ra, và câu chữ đó nói người dùng làm gì tiếp.

Ref: tra J, 📁 §1

### 3.8 Xử lý feedback đổi hướng
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —

Nếu feedback ở phase này làm đổi phạm vi hoặc phương án, sửa phase 1 hoặc phase 2 trước.

- Sau đó mới sang phase 4.

## 4. Acceptance & Test Design | Business Analyst + Tester

**Qua phase khi:** không còn câu hỏi nào chặn việc build. Mỗi mục "Trong phạm vi" và mỗi màn hình đều có quy tắc phủ. Người đưa vấn đề đã xác nhận các ví dụ.

**Đầu ra:** quy tắc có mã và ví dụ có expected, ghi vào mục Rules and examples của task. AC có mã và test design, ghi vào T2 và T3.

### 4.1 Làm example mapping

Example mapping biến flow và màn hình của phase 3 thành quy tắc và ví dụ.

#### 4.1a Viết quy tắc và ví dụ
Ai làm: Claude soạn; Owner chốt · Ai kiểm: ⚙ review: tìm quy tắc thiếu, ví dụ mâu thuẫn

Viết quy tắc theo từng flow và màn hình của phase 3.

- Mỗi quy tắc ghi flow hoặc màn hình mà nó thuộc về.
- Mỗi quy tắc có ít nhất một ví dụ cụ thể, có số, có tên và có tình huống.
- Nếu không viết được ví dụ cho một quy tắc, ghi chỗ đó thành một câu hỏi trong mục Questions.

#### 4.1b Biến edge case thành ví dụ
Ai làm: Claude soạn; Owner chốt · Ai kiểm: ⚙ review: tìm edge case còn thiếu (tra F); người đưa vấn đề xác nhận expected

Mỗi edge case của phase 1 và 2, và mỗi nhánh rẽ của flow ở phase 3, có một ví dụ cụ thể.

- Ví dụ có số, có tên và có expected. Expected nói cả người dùng thấy gì và làm gì tiếp 📁 §3

#### 4.1c Viết ví dụ cho edge case giá trị
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner quyết expected tại từng điểm

Với mỗi giới hạn trong data dictionary ở 3.3, viết ví dụ cho giá trị ngay tại ranh giới, ngay trên và ngay dưới.

- Kỹ thuật là EP và BVA.

Ref: tra B

#### 4.1d Đọc lại bản map
Ai làm: Owner · Ai kiểm: —

Owner đọc lại toàn bộ bản map rồi quyết định bước tiếp theo.

- Nếu còn nhiều câu hỏi, chưa build.
- Nếu có quá nhiều quy tắc, chia nhỏ ticket rồi quay lại phase 2.
- Nếu một quy tắc cần nhiều ví dụ, làm chậm và kỹ ở quy tắc đó.

#### 4.1e Kiểm phủ quy tắc
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Mỗi mục "Trong phạm vi", mỗi màn hình ở 3.2, và mỗi ô "không" của ma trận phân quyền ở 3.4 (nếu có) phải có ít nhất một quy tắc.

- Chỗ nào còn trống thì thêm quy tắc mới, hoặc ghi một câu hỏi trong mục Questions.

### 4.2 Chọn NFR
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —

Chọn các NFR áp dụng, theo danh sách ở tra C.

Ref: tra C, 📁 §5

### 4.3 Chuyển quy tắc thành test

Mỗi quy tắc thành AC, rồi thành test ở đúng test level.

#### 4.3a Viết AC
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Viết mỗi quy tắc thành AC dạng `WHEN … THE SYSTEM SHALL …`.

- Mỗi AC có một ID.

#### 4.3b Chọn test level
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Với từng quy tắc, trả lời ba câu hỏi, rồi chọn kỹ thuật test và test level.

Ref: tra B, 📁 §7

#### 4.3c Viết test cho hành vi cũ cần giữ
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

Nếu ticket sửa một tính năng đang chạy, viết test cho hành vi cũ cần giữ trước khi sửa.

### 4.4 Quay lại sửa mockup
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —

Nếu một quy tắc làm đổi màn hình hoặc trạng thái, sửa mockup ở phase 3 trước khi code.

## 5. Implementation | Developer

**Qua phase khi:** Máy báo mọi check đều xanh.

**Đầu ra:** test viết trước code, code, và nhật ký tiến độ. Nhật ký ghi vào T4 của task. Code và test vào commit.

### 5.1 Viết test rồi viết code

Cả task là một slice, đi qua hai bước: test, rồi code.

#### 5.1a Viết test trước code
Ai làm: Claude, session mới soạn; Owner chốt · Ai kiểm: ⚙ review-round; Owner chốt
Claude: ⚙ 5.1a

Claude ở một session mới viết test từ các ví dụ của phase 4, trước khi có code.

- Giá trị expected lấy từ ví dụ, không lấy từ code đang có.
- Mỗi test ghi ID của AC mà nó kiểm tra.
- Vòng review R1 chỉ hỏi một câu: test có diễn đạt đúng các ví dụ của phase 4 không.
- Owner chỉ chốt phần 1 của file verdicts (các quyết định ở mức sản phẩm). Owner không cần đọc code, finding hay bảng traceability.

Ref: tra H, tra K

#### 5.1b Viết code cho task
Ai làm: Claude, session mới soạn; Owner chốt · Ai kiểm: ⚙ review-round; Owner chốt
Claude: ⚙ 5.1b

Claude ở một session mới khác viết code chỉ dựa vào spec (task) và test của 5.1a, không dựa vào code cũ.

- Đầu ra: các test của 5.1a xanh, và commit theo layer trên nhánh riêng, không lên master.
- Session này không được sửa test.
- Nếu Claude thêm một test sau khi đã có code, Claude làm test đó đỏ một lần bằng cách tạm phá dòng code mà test kiểm tra, rồi ghi lại cách làm.
- Nếu thấy một test sai, Claude dừng lại và báo Owner. Owner sửa ví dụ ở phase 4 trước, rồi mới sửa test.
- Vòng review R2 xét ba góc: code đúng với AC chưa, có thay đổi nào ngoài phạm vi task không, và code có theo luật của repo không.
- Nếu slice chạm quyền, dữ liệu cá nhân hoặc redirect, R2 thêm góc bảo mật. Nếu spec có yêu cầu về performance, R2 thêm góc performance.
- Owner chỉ chốt phần 1 của file verdicts (các quyết định ở mức sản phẩm). Owner không cần đọc code, finding hay bảng traceability.

Ref: tra K, tra L

### 5.2 Chạy check của máy
Ai làm: Máy · Ai kiểm: Owner xem output

Máy chạy type check, lint, test và build.

Ref: 📁 §7

## 6. Testing | Tester

**Qua phase khi:** Owner xác nhận không còn bug đã biết trong phạm vi.

**Đầu ra:** kết quả kiểm 4 lớp, các bug kèm lý do "tại sao lọt", và ghi chú bàn giao. Ghi vào T5 của task.

### 6.1 Review phần sửa và đọc diff

Phần sửa sau R2 được review trước, rồi Owner mới đọc diff.

#### 6.1a Review phần sửa sau R2
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Review của `/cap`; Owner chốt
Claude: ⚙ 6.1a

Mọi thay đổi đổi logic sau vòng R2 đi qua bước review của `/cap`.

- Ví dụ: lần sửa CI, hoặc fixup đổi logic.
- Nếu không có thay đổi nào đổi logic thì bỏ qua bước này.

Ref: tra L

#### 6.1b Đọc diff nguội
Ai làm: Owner · Ai kiểm: —
Claude: ⚙ 6.1b

Owner đọc diff khi đầu óc đã nguội và giải thích được từng dòng.

- Trước khi đọc, Owner xem thẻ coverage ở đầu file verdicts của R2: góc nào đã review và góc nào chưa.
- Owner đọc lần lượt từng commit trên nhánh.
- Owner tập trung vào ý định và cảm nhận sản phẩm, và nhìn từ góc người dùng và người vận hành.
- Nếu R2 đã review góc bảo mật, Owner chỉ đọc lướt từ góc kẻ tấn công.
- Tìm cả những thay đổi không liên quan tới task.
- Dòng nào chưa giải thích được thì chưa merge.
- Nếu cần sửa, Claude sửa rồi gộp vào commit gốc.

Ref: tra D, tra L

### 6.2 Tự kiểm 4 lớp trên app thật

Owner kiểm theo thứ tự, và nếu lớp trước hỏng thì chưa sang lớp sau.

#### 6.2a Chạy đường hạnh phúc (lớp 1)
Ai làm: Owner · Ai kiểm: —

Owner chạy đúng kịch bản chính bằng tay, như người dùng thật, theo các ví dụ của phase 4 và flow của phase 3.

- Lớp này không phải là "unit test pass".

#### 6.2b Chạy edge case (lớp 2)
Ai làm: Owner · Ai kiểm: —

Owner chạy các edge case đã thành ví dụ ở phase 4.

- Xem từng trạng thái của màn hình khi có thứ bị lỗi (tra J, phần J4).

#### 6.2c Kiểm hồi quy quanh chỗ sửa (lớp 3)
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —
Claude: ⚙ 6.2c

Owner mở thử ít nhất một chỗ dùng chung hàm, component hoặc endpoint vừa sửa.

- Claude tìm sẵn danh sách những chỗ dùng chung đó, bắt đầu từ blast radius ở phase 2.

Ref: 📁 §6

#### 6.2d Thử với dữ liệu thật (lớp 4)
Ai làm: Owner · Ai kiểm: —

Owner thử với dữ liệu cũ, dữ liệu bẩn, thiếu field hoặc sai format.

- Không dùng seed sạch.

Ref: 📁 §3, §6

### 6.3 Khám phá exploratory 30 phút
Ai làm: Owner · Ai kiểm: —

Owner khám phá theo một charter "Khám phá ‹vùng› với ‹cách hoặc dữ liệu› để tìm ‹loại vấn đề›".

- Owner ghi lại bug, câu hỏi và ý tưởng.

### 6.4 Kiểm NFR
Ai làm: Owner · Ai kiểm: —

Owner kiểm các NFR đã chọn ở phase 4.

Ref: 📁 §5

### 6.5 Viết ghi chú bàn giao
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Tester (nếu có)

Ghi chú bàn giao nói đổi những gì, test ở đâu, và rủi ro nằm ở đâu.

Ref: 📁 §9

## 7. Release | Release Manager

**Qua phase khi:** smoke test ở PROD đã qua.

**Đầu ra:** cách rollback và kết quả smoke test ở PROD. Ghi vào T6 của task.

### 7.1 Viết kế hoạch rollback
Ai làm: Claude soạn; Owner chốt · Ai kiểm: —

Viết trước khi release cách rollback, ai làm, và feature flag nào (nếu có).

- Ghi cả migration, config và env của từng môi trường.

Ref: 📁 §8

### 7.2 Đưa qua từng môi trường
Ai làm: Owner · Ai kiểm: Người nghiệm thu UAT

Owner đưa lên SIT, rồi UAT, rồi PROD.

- Chạy smoke test sau mỗi bước.

Ref: 📁 §8

## 8. Post-release Review | Product Manager

**Qua phase khi:** Owner đã so thước đo ở phase 1 với kết quả thật.

**Đầu ra:** "xong" so với kết quả thật, ghi vào nhật ký T4 của task. Một dòng bài học ghi vào hồ sơ project.

### 8.1 Theo dõi sau release
Ai làm: Owner · Ai kiểm: Người đưa vấn đề

Owner theo dõi lỗi và log trong số ngày ghi ở hồ sơ project.

- Owner báo lại kết quả.

Ref: 📁 §8

### 8.2 Viết as-built doc
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner

As-built doc ghi lại hệ thống đã được làm ra như thế nào.

Ref: 📁 §10

### 8.3 Dọn dẹp code tạm
Ai làm: Claude soạn; Owner chốt · Ai kiểm: Owner đọc diff

Gỡ feature flag và code tạm, nếu có.

### 8.4 Ghi bài học
Ai làm: Owner trước; Claude kiểm tra · Ai kiểm: —

Owner ghi một dòng bài học vào hồ sơ project.

- Nếu bài học đó lặp lại ở project thứ hai, sửa checklist.

---

Gặp bug ở bất kỳ phase nào: xem tra E.
