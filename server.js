const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/verify-code', (req, res) => {
    const code = req.body.code?.toUpperCase();

    if (!code) {
        return res.status(400).json({ success: false, message: "يرجى إدخال الكود." });
    }

    const codesFilePath = path.join(__dirname, 'codes.json');
    fs.readFile(codesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("خطأ في قراءة ملف الأكواد:", err);
            return res.status(500).json({ success: false, message: "خطأ في السيرفر." });
        }

        let codes;
        try {
            codes = JSON.parse(data);
        } catch (e) {
            console.error("خطأ في قراءة JSON:", e);
            return res.status(500).json({ success: false, message: "ملف الأكواد تالف." });
        }

        if (!(code in codes)) {
            console.log("الكود غير موجود:", code);
            return res.status(400).json({ success: false, message: "الكود غير موجود." });
        }

        // حذف الكود من الذاكرة
        delete codes[code];
        console.log("تم حذف الكود:", code);

        // كتابة الملف الجديد بعد الحذف
        fs.writeFile(codesFilePath, JSON.stringify(codes, null, 2), (err) => {
            if (err) {
                console.error("خطأ في كتابة ملف الأكواد:", err);
                return res.status(500).json({ success: false, message: "فشل في تحديث الأكواد." });
            }

            console.log("تم حفظ التعديلات بنجاح.");
            return res.json({ success: true, message: "تم التحقق من الكود بنجاح." });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});