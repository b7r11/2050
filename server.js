const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// مسار التحقق من الكود
app.post('/verify-code', (req, res) => {
    const code = req.body.code.toUpperCase();

    // قراءة ملف الأكواد
    fs.readFile('codes.json', 'utf8', (err, data) => {
        if (err) {
            console.error("خطأ في قراءة ملف الأكواد:", err);
            return res.status(500).json({ success: false, message: "خطأ في السيرفر" });
        }

        let codes;
        try {
            codes = JSON.parse(data);
        } catch (e) {
            console.error("خطأ في تحويل JSON:", e);
            return res.status(500).json({ success: false, message: "ملف الأكواد غير صالح" });
        }

        // تحقق من وجود الكود
        if (!(code in codes)) {
            return res.status(400).json({ success: false, message: "الكود غير موجود." });
        }

        if (!codes[code]) {
            return res.status(400).json({ success: false, message: "تم استخدام هذا الكود من قبل." });
        }

        // حذف الكود (للاستخدام لمرة واحدة)
        delete codes[code];

        // إعادة كتابة الملف بعد حذف الكود
        fs.writeFile('codes.json', JSON.stringify(codes, null, 2), (err) => {
            if (err) {
                console.error("خطأ في كتابة ملف الأكواد:", err);
                return res.status(500).json({ success: false, message: "فشل حفظ الأكواد." });
            }

            return res.json({ success: true, message: "تم التحقق من الكود بنجاح." });
        });
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});