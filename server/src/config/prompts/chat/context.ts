import fs from 'fs';
import path from 'path';

// Load content synchronously at startup
const soTaySvPath = path.join(__dirname, '../../../../data/so_tay_sv.md');
const quyChePath = path.join(__dirname, '../../../../data/quy_che.md');

let soTaySvContent = "";
let quyCheContent = "";

try {
    soTaySvContent = fs.readFileSync(soTaySvPath, 'utf-8');
    quyCheContent = fs.readFileSync(quyChePath, 'utf-8');
    console.log("✅ [Context] Loaded Sổ Tay SV & Quy Chế successfully.");
} catch (error) {
    console.error("❌ [Context] Error loading markdown files:", error);
    soTaySvContent = "Không thể tải dữ liệu Sổ Tay Sinh Viên.";
    quyCheContent = "Không thể tải dữ liệu Quy Chế Đào Tạo.";
}

export const context = `
    DƯỚI ĐÂY LÀ KHO TÀI LIỆU CHÍNH THỨC CỦA NHÀ TRƯỜNG (CONTEXT). BẠN PHẢI SỬ DỤNG THÔNG TIN TRONG NÀY ĐỂ TRẢ LỜI. KHÔNG ĐƯỢC BỊA RA CÁC QUY ĐỊNH KHÔNG CÓ TRONG ĐÂY.

    === BẮT ĐẦU TÀI LIỆU: SỔ TAY SINH VIÊN HCMUTE ===
    ${soTaySvContent}
    === KẾT THÚC TÀI LIỆU: SỔ TAY SINH VIÊN HCMUTE ===

    === BẮT ĐẦU TÀI LIỆU: QUY CHẾ ĐÀO TẠO ĐẠI HỌC ===
    ${quyCheContent}
    === KẾT THÚC TÀI LIỆU: QUY CHẾ ĐÀO TẠO ĐẠI HỌC ===
    `;
