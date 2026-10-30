<!-- format: 2 -->
# Lookup

Chỉ mở khi checklist chỉ tới. Không đọc từ đầu tới cuối.

## A. Chọn size

Size chọn theo **rủi ro**, không theo "tính năng mới hay sửa cũ".

| Size | Dấu hiệu | Phase chạy |
| --- | --- | --- |
| **L** | Có **một** trong: đổi hành vi người dùng đang dựa vào · chạm tiền, quyền, dữ liệu, migration · nhiều hệ thống · khó đảo ngược | Đủ 8 phase, phase 2 có design doc |
| **S** | Rõ nguyên nhân, chạm một chỗ, đảo ngược dễ | 1 (một câu) → 5 → 6 → 7 |
| **M** | Còn lại | Đủ 8 phase, bản rút gọn |

**Nâng size** ngay khi đang làm mà gặp dấu hiệu của size cao hơn. Không bao giờ hạ size giữa chừng để kịp giờ.

## B. Ba câu hỏi, kỹ thuật, test level

**Ba câu hỏi cho từng quy tắc**

1. Sai ở đâu thì đắt? → dồn test vào đó. Gán field, hành vi của framework thì không test.
2. "Đúng" lấy từ đâu? → từ quy tắc và AC, **không** từ code.
3. Bao nhiêu là đủ? → chọn kỹ thuật bên dưới, đếm coverage item.

**Chọn kỹ thuật theo hình dạng input**

| Hình dạng | Kỹ thuật | Ai làm |
| --- | --- | --- |
| Khoảng giá trị | EP + BVA | Claude sinh, Owner kiểm edge case |
| Nhiều điều kiện đan nhau trong cùng một quy tắc | Decision table | Claude dựng, Owner thẩm định: thiếu/thừa điều kiện, tổng cột, N/A có lý do |
| Nhiều tham số độc lập (trình duyệt × ngôn ngữ × vai trò) | Pairwise | Tool (PICT) |
| Có trạng thái và chuyển trạng thái | State transition | Claude vẽ, Owner kiểm chuyển không hợp lệ |
| Luồng nhiều bước | Scenario test theo đường đi | Owner chọn đường đi |
| Có quy luật bất biến | Property-based | Claude viết, Owner duyệt quy luật |

**Test level**

- Logic trong một hàm hoặc một class → unit
- **Chỗ ghép nối** giữa hai module, hoặc với DB hay dịch vụ ngoài → integration (unit không bắt được)
- Luồng người dùng quan trọng nhất → E2E, ít thôi

## C. NFR

Chỉ chọn cái áp dụng: performance · phân quyền · bảo mật input · mobile · accessibility · log/monitoring

## D. Đọc diff

- Đọc **nguội**, như thể người khác viết: sau một khoảng nghỉ, tốt nhất là hôm sau. Diff cho thấy cái **đã đổi**, không phải cái Owner **tưởng** mình đã đổi; khi AI viết code, hai thứ này lệch nhau nhiều hơn người ta nghĩ
- Mỗi dòng phải giải thích được. Dòng nào không giải thích được thì chưa merge
- Tìm thứ **không liên quan tới task**: file lạc vào, import thừa, format đổi cả file, "cải tiến" AI tự thêm. Đây là nguồn lỗi âm thầm lớn nhất khi dùng AI nhiều
- Đọc lần lượt theo từng góc nhìn: **người dùng**, **người vận hành**, **kẻ tấn công**
- Test bám **hành vi**, không bám implementation (refactor mà test đỏ là dấu hiệu bám implementation)
- Coverage chỉ dùng để tìm chỗ chưa test, **không** dùng làm cổng
- Reviewer AI luôn tìm ra gì đó: chỉ nhận finding ảnh hưởng correctness hoặc AC

## E. Khi gặp bug

1. Chốt **severity** (hỏng nặng cỡ nào) và **priority** (gấp cỡ nào) → sửa ngay, hoặc mở ticket **có hạn**. Không để dồn trong backlog.
2. Ghi repro steps; tái hiện bằng một test **đỏ** trước khi sửa (debugging).
3. Sửa → test đó xanh (confirmation testing) → chạy lại bộ test liên quan (regression testing).
4. Ghi **một dòng: lỗi gì, tại sao lọt** vào run log của ticket. "Tại sao lọt" trỏ tới **phase và dòng** của checklist (ở phase 6 thì tới lớp 1–4), vì bug có thể lọt ở bất kỳ phase nào: hiểu sai vấn đề, thiếu quy tắc, expected chép từ code, không đọc diff, môi trường release. Sau vài tháng, các dòng này là khuôn mẫu lỗi của chính Owner. Nếu là lỗ hổng của quy trình thì sửa checklist.
5. Bug hay tụ cụm: kiểm tra thêm vùng code quanh chỗ vừa sửa.

## F. Danh sách quét edge case (chung cho mọi project)

Edge case của **giá trị** (số, độ dài) thì dùng EP + BVA ở mục B. Edge case riêng của từng project nằm trong hồ sơ project ở `.context/checklist-profile.md`. Phase 4 dùng cả hai phần dưới đây làm danh sách kiểm tra chỗ còn thiếu.

**Phép thử tờ giấy:** nếu người dùng làm việc này bằng một cuốn sổ giấy, chuyện đó vẫn xảy ra không? Có → edge case của tình huống, ghi ở phase 1. Không → edge case do phương án sinh ra, để phase 2.

**Phần 1 · Edge case của tình huống** (phase 1; Claude quét sau lượt tự phân tích của Owner):

1. Khi nào việc này khó hơn bình thường: đang gấp, một tay, ở nơi lạ, mạng yếu?
2. Thông tin sai hoặc đã cũ thì sao?
3. Có nhiều hơn một không: nhiều người, nhiều món, nhiều mục đích?
4. Việc này dừng, đổi, hay lặp lại thế nào?
5. Bị dùng sai thì sao, và ai chịu hậu quả?

**Phần 2 · Edge case hệ thống** (phase 2, dòng rabbit hole):

- Rỗng (chưa có dữ liệu nào)
- Rất nhiều (danh sách dài, file lớn)
- Hai người cùng sửa một thứ
- Mất mạng giữa chừng
- Dữ liệu lịch sử sai định dạng
- Hệ thống bên ngoài chậm hoặc lỗi

## G. Câu hỏi phase 1

### G1. Bộ câu hỏi buổi brief (dùng chung cho mọi vấn đề)

Câu nào cũng mở và không nói tới giải pháp. Owner hỏi trong buổi brief và ghi nguyên văn câu trả lời. Câu nào hồ sơ project đã trả lời thì Owner nêu ra như một giả định, chỉ hỏi phần lệch (Claude làm theo skill `checklist` của plugin ctx).

1. Vấn đề bạn đang thấy là gì?
2. Kể một lần cụ thể gần đây nó xảy ra. Bao lâu thì nó xảy ra một lần?
3. Ai gặp vấn đề này? Nó liên quan tới thông tin của ai, mấy người?
4. Hôm nay bạn đang xoay xở thế nào?
5. Nếu không làm thì sao?
6. Vì sao lúc này? Có hạn chót hay giới hạn công sức không?
7. Khi xong, bạn sẽ thấy điều gì khác đi?
8. Tôi nên hỏi thêm ai, xem tài liệu hay dữ liệu nào? Câu này quyết định vòng confirm gửi cho những ai.

### G2. Danh mục kiểm tra lúc tự phân tích

**Cách dùng:** Claude đọc lướt sau lượt của Owner và đánh dấu câu nào chưa có câu trả lời. Thường chỉ 3–4 câu sáng lên; đừng hỏi hết. Câu hỏi riêng của project nằm ở hồ sơ project §4.

**Phép thử trước khi đưa vào vòng confirm:** người đưa vấn đề có trả lời được câu này không? Được → câu hỏi nhu cầu, gửi nguyên câu. Không → câu thiết kế; Claude đổi nó thành đề xuất có lựa chọn và mặc định.

1. **Người và bối cảnh.** Ai bấm vào đây? Lúc đó họ đang ở đâu, tay có rảnh không, mạng thế nào? Một ngày họ làm việc này 1 lần hay 50 lần?
2. **Dữ liệu từ đâu.** Nhập tay, import, integration, hay hệ thống tự tính? Trường nào bắt buộc, và ai là người quyết định điều đó? Dữ liệu lịch sử có đúng định dạng này không?
3. **Ai được làm gì.** Ai xem được, ai sửa được? Sửa sau khi việc đã đóng thì sao? Có cần dấu vết ai sửa gì không? Tính năng này có trên gói nào?
4. **Trạng thái và thời gian.** Có bao nhiêu trạng thái, và đi ngược được không? Cái gì tự động, cái gì cần người bấm? Quá hạn thì sao, hủy giữa đường thì sao? *(Nhóm này sáng lên → dùng state transition ở tra B.)*
5. **Cái gì vỡ.** Đã quét bằng tra F phần 1; bỏ qua nhóm này.
6. **Tiền.** Cái này có chạm vào hóa đơn không? Nếu đã đẩy sang kế toán rồi mà sửa thì sao? Ai chịu hậu quả nếu số sai: khách, người làm, hay công ty? *(Nhóm này sáng lên → nâng lên size L.)*

## H. Tự động hay làm tay

Danh sách test case là của **Owner**, không phải của Claude. Nguồn của nó là flow ở phase 3, ví dụ và edge case ở phase 4: edge case nghĩ ra lúc đặc tả chính là test case lúc kiểm.

| Loại | Cách kiểm | Lưu ý |
| --- | --- | --- |
| Logic thuần: hàm tính toán, transform dữ liệu, quy tắc validation (input/output rõ ràng) | Claude viết **code của test** | **Expected lấy từ quy tắc và ví dụ của phase 4, không đọc từ code.** Test lấy expected từ code thì sai cùng với code mà vẫn xanh (test oracle problem, "reverse TDD") |
| Luồng người dùng, cái thật sự hiện trên màn hình, hiệu năng cảm nhận được | Owner làm tay (tự kiểm 4 lớp ở phase 6) | Claude không biết người dùng đang đứng ở đâu, tay có rảnh không (📁 §1) |
| Chỗ ghép nối nhiều hệ (module với module, app với DB hay dịch vụ ngoài) | Làm tay lần đầu, rồi viết **integration test** tự động | Unit test không bắt được lỗi ở chỗ ghép nối |
| Đường chính quan trọng nhất | Làm tay lần đầu, rồi viết **E2E** | Để khỏi phải kiểm tay lại mỗi lần release; giữ số E2E ít |

## I. Review độc lập ⚙ review

Item nào ghi "⚙ review" thì làm theo mục này. Phần sau dấu hai chấm (ví dụ "⚙ review: tìm edge case còn thiếu") là câu hỏi cho reviewer.

1. Hai reviewer chạy độc lập: Claude, session mới (subagent context sạch) và Codex (ChatGPT qua plugin codex). Không reviewer nào thấy kết quả của người kia.
2. Cả hai nhận cùng một context packet, và không nhận ý kiến hay kết luận của Claude.
3. Claude ở thread chính gộp kết quả, và ghi mỗi finding là đúng, sai, hay chưa chắc. Claude không tự biến finding thành quyết định.
4. Owner lọc finding: giữ, bỏ, hay để sau. Finding giữ lại thành việc cần sửa hoặc thẻ câu hỏi.
5. Nếu Codex hết quota hoặc lỗi, báo cáo ghi "thiếu Codex".

## J. Flow, màn hình và trạng thái

Phase 3 dùng mục này. Mục này viết cho cả hệ thống nhiều role, nhiều team; phần nào không áp dụng cho ticket thì bỏ qua, không bỏ khỏi bảng.

### J1. Theo loại ticket

Size vẫn chọn theo rủi ro (tra A). Bảng này chỉ nói phase 3 làm gì khác nhau theo loại ticket. Bug ở size S đi theo tra E, không qua phase 3.

| Loại ticket | Flow | Danh sách màn hình | Data dictionary | Mockup và trạng thái |
| --- | --- | --- | --- | --- |
| **Tính năng mới** | Flow mới, đủ nhánh rẽ ở từng bước | Màn hình mới, và màn hình cũ có đổi | Mọi trường mới | Đủ trạng thái áp dụng (J4) |
| **Nâng cấp hoặc refactor** | Flow đang chạy, viết lại đúng như hiện tại; đánh dấu bước nào đổi bên trong. Flow này là hành vi phải giữ (4.3c) | Màn hình chịu ảnh hưởng; danh sách này là danh sách kiểm hồi quy ở phase 6 | Trường đổi kiểu, đổi tên, đổi nghĩa, đổi giới hạn | Chỉ khi UI đổi. UI không đổi thì chụp màn hình trước khi sửa để so sau khi sửa |
| **Sửa bug** | Flow có bug: các bước tái hiện là một nhánh rẽ; ghi bước nào sai và bước đúng phải là gì | Màn hình hiện bug, và màn hình dùng chung chỗ sửa | Trường liên quan tới bug (giá trị bẩn, sai định dạng, rỗng) | Trạng thái đúng mà màn hình phải hiện sau khi sửa |
| **Không có UI** (API, job, integration) | Các bước của hệ thống và của hệ thống bên ngoài | Endpoint, event, message, file thay cho màn hình | Payload và mã lỗi | Bỏ |

### J2. Cách viết flow

Một flow là một việc người dùng hoặc hệ thống làm cho xong, từ lúc bắt đầu tới lúc thấy kết quả. Flow có mã (F1, F2) để quy tắc và màn hình trỏ tới.

1. Viết đường chính: các bước đánh số, mỗi bước một hành động của người dùng hoặc một phản hồi của hệ thống.
2. Ở từng bước, quét nhánh rẽ theo danh sách dưới. Mỗi nhánh có mã theo bước (bước 3 thì 3a, 3b) và ghi hệ thống làm gì, người dùng làm gì tiếp.
3. Nhánh rẽ nào kéo theo một quyết định thì thành thẻ câu hỏi ở E0.

Danh sách quét nhánh rẽ ở mỗi bước:
- Dữ liệu nhập sai, thiếu, trùng
- Server lỗi, mạng mất, hệ thống ngoài chậm hoặc lỗi
- Hết phiên đăng nhập, không có quyền ở bước này
- Người dùng hủy, quay lại, đóng tab giữa chừng
- Hai người cùng sửa một thứ; dữ liệu đã đổi từ lúc mở
- Dữ liệu cũ, dữ liệu lịch sử sai định dạng

Ví dụ:
> **F1 · Owner thêm một món**
> 1. Owner mở danh sách món ở console, bấm "Thêm".
> 2. Owner điền form, bấm "Lưu".
> 3. Hệ thống lưu, đóng form, hiện món mới ở đầu danh sách, hiện thông báo "Đã lưu".
>
> 2a. Thiếu trường bắt buộc: form báo lỗi ở đúng ô, không gửi; Owner điền rồi lưu lại.
> 3a. Server lỗi: form giữ nguyên dữ liệu đã nhập, hiện lỗi, nút "Lưu" bấm lại được.
> 3b. Hết phiên: chuyển sang đăng nhập; đăng nhập xong quay lại form, dữ liệu còn.

### J3. Danh sách màn hình

| Mã | Màn hình | App | Flow đi qua | Trạng thái áp dụng (J4) |
| --- | --- | --- | --- | --- |
| S1 | Danh sách món | console | F1, F2 | rỗng, đang tải, lỗi, thành công |

Mỗi hộp thoại xác nhận, trang lỗi, email, thông báo đẩy cũng là một dòng. Bảng này không có cột quy tắc, vì quy tắc chỉ có ở phase 4. Ở phase 4, mỗi quy tắc ghi các màn hình nó phủ; màn hình nào không có quy tắc nào phủ thì dòng 4.1e bắt được.

### J4. Trạng thái của một màn hình

Mỗi màn hình chọn những trạng thái áp dụng. Mỗi trạng thái ghi câu chữ hiện ra và người dùng làm gì tiếp. Thông báo lỗi nằm ngay cạnh chỗ có vấn đề và giữ lại dữ liệu người dùng đã nhập.

| Trạng thái | Khi nào | Hỏi gì |
| --- | --- | --- |
| Lần đầu dùng | Chưa có dữ liệu nào, kể cả dữ liệu phụ thuộc (chưa có người, chưa có danh mục) | Người dùng bắt đầu từ đâu? |
| Rỗng | Có dữ liệu nhưng danh sách này trống | Khác gì với "lần đầu dùng"? |
| Không có kết quả | Tìm kiếm hoặc lọc không ra gì | Xóa bộ lọc bằng cách nào? |
| Đang tải | Chờ server | Có giữ layout không, chờ lâu thì sao? |
| Một phần | Dữ liệu thiếu nhiều trường, hoặc tải được một phần | Trường trống hiện thế nào? |
| Lỗi | Server lỗi, dữ liệu sai | Thử lại ở đâu, dữ liệu đã nhập còn không? |
| Mất mạng | Không kết nối được | Có cần làm không, hay chỉ báo lỗi? |
| Không có quyền | Role không được xem hoặc làm | Thấy gì: ẩn, khóa, hay trang báo? |
| Thành công | Lưu, xóa, gửi xong | Thông báo gì, rồi đi đâu? |

### J5. Data dictionary

| Trường | Nghĩa | Kiểu | Định dạng, ví dụ | Bắt buộc | Giới hạn | Nhãn hiển thị |
| --- | --- | --- | --- | --- | --- | --- |
| `strength` | Lượng hoạt chất trong một đơn vị thuốc | text | "500mg" | có, với thuốc | 1–50 ký tự | Hàm lượng |
| `dose` | Lượng dùng mỗi lần | text | "2 viên" | không | 0–100 ký tự | Liều |

Enum ghi từng giá trị và nhãn của nó (`LONG_TERM` → "Dùng lâu dài"). Hai trường dễ nhầm nghĩa với nhau thì ghi rõ khác nhau ở đâu. Cột "Giới hạn" là đầu vào của EP + BVA ở 4.1c.

### J6. Hệ thống phức tạp: chỉ làm khi áp dụng

| Khi nào | Làm gì | Đầu ra |
| --- | --- | --- |
| Nhiều role (admin, nhân viên, khách, đối tác, machine token) | **Ma trận phân quyền**: role × hành động (xem, tạo, sửa, xóa, duyệt, export), và role × màn hình | Bảng; mỗi ô "không" thành một ví dụ ở phase 4 |
| Entity có vòng đời (đơn hàng, hồ sơ, yêu cầu duyệt) | **Sơ đồ trạng thái**: trạng thái, sự kiện chuyển, ai bấm hay hệ thống tự làm, bước nào không đi ngược được (state transition ở tra B) | Sơ đồ hoặc bảng chuyển trạng thái |
| Nhiều hệ thống (integration, queue, webhook) | **Thứ tự gọi giữa các hệ thống**: ai gọi ai, gọi lại khi lỗi, gửi trùng thì sao (idempotency), hết thời gian chờ thì sao | Sequence diagram hoặc danh sách bước |
| Nhiều bước duyệt hoặc nhiều người cùng làm | Flow theo từng role (swimlane); bàn giao giữa các role | Flow có cột theo role |
| Thước đo ở phase 1 cần số liệu từ app | **Sự kiện analytics**: tên, lúc bắn, thuộc tính; không chứa dữ liệu nhạy cảm | Danh sách sự kiện |
| Dữ liệu cần dấu vết ai sửa gì | **Audit**: hành động nào được ghi, giữ bao lâu | Danh sách hành động |

Không đưa vào checklist: user story theo mẫu "As a…", story point, Definition of Ready riêng của team. Đây là công cụ phối hợp giữa nhiều developer; phase 1 và cổng "Qua phase khi" đã làm phần việc của chúng.

## K. Review sau khi sinh code hoặc test ⚙ review-round

Item nào ghi "⚙ review-round" thì Claude chạy skill `review-round` sau khi sinh xong một đợt code hoặc test, trước khi Owner xem và trước khi commit.

1. Hai reviewer chạy song song: một subagent Claude và Codex. Claude kiểm tra từng finding, sửa các finding đúng, rồi chạy lại test.
2. Owner chỉ chốt phần 1 của file verdicts: các quyết định đổi điều người dùng thấy hoặc đổi spec đã duyệt. Finding, bảng traceability và kết quả chạy lại chỉ để tham khảo.
3. File cho Owner đọc nằm trong `.context/tmp/` của repo.
4. Mỗi vòng có góc nhìn riêng. Vòng R1 chạy sau khi viết test và chỉ hỏi test có diễn đạt đúng các ví dụ không. Vòng R2 chạy sau khi viết code, trước khi commit, và review ba góc: correctness theo AC, thay đổi ngoài phạm vi task, và luật của repo.
5. Cờ rủi ro bật thêm góc chuyên môn. Nếu slice chạm quyền, dữ liệu cá nhân hoặc redirect, R2 thêm góc bảo mật. Nếu spec có yêu cầu về performance, R2 thêm góc performance.
6. Đầu mỗi file verdicts có một thẻ coverage. Thẻ này liệt kê các góc đã review, số finding của mỗi góc, và các góc chưa review. Owner đọc thẻ này trước khi đọc diff, để biết phần nào Owner phải tự soi (mục D).
7. Mọi thay đổi sau R2 mà đổi logic, ví dụ lần sửa CI hoặc fixup, đi qua bước review của `/cap` thay vì một vòng review-round mới.

Khác với ⚙ review (mục I): ở mục I, Owner tự lọc finding. Ở mục này, Claude tự quyết các finding kỹ thuật.

## L. Commit trên nhánh riêng và review theo commit

Code của một slice đi qua năm bước, từ lúc Claude viết tới lúc Owner duyệt xong:

1. Claude viết code trên nhánh riêng của slice, ví dụ `feat/<epic>-s1`. Với size M, cả task là một slice, ví dụ nhánh `feat/<task>`. Claude không commit lên master.
2. Claude chạy vòng R2 của ⚙ review-round (mục K). Nếu review sinh ra quyết định ở mức sản phẩm, Claude hỏi Owner trước khi commit.
3. Claude tách commit theo layer: shared, API, console, landing, e2e. Commit nào cũng tự xanh. Owner duyệt danh sách commit và message, rồi Claude commit và push nhánh.
4. Owner review từng commit một, theo cách đọc ở mục D. Claude nói thẳng trong session file nào cần đọc kỹ và file nào chỉ cần đọc lướt.
5. Nếu Owner yêu cầu sửa, Claude gộp mỗi chỗ sửa vào đúng commit gốc của layer. Nhánh vẫn giữ một commit cho mỗi layer và không có commit "fix review" riêng.

Nhánh chỉ merge vào master sau khi phase 6 xong.
