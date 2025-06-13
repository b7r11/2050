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

        if (codes[code] <= 0) {
            return res.status(400).json({ success: false, message: "تم استهلاك هذا الكود بالكامل." });
        }

        // خصم استخدام واحد من الكود
        codes[code] -= 1;
        console.log(`تم استخدام الكود: ${code} - المتبقي: ${codes[code]}`);

        fs.writeFile(codesFilePath, JSON.stringify(codes, null, 2), (err) => {
            if (err) {
                console.error("خطأ في كتابة ملف الأكواد:", err);
                return res.status(500).json({ success: false, message: "فشل في تحديث الأكواد." });
            }

            return res.json({ success: true, message: `تم التحقق من الكود. المتبقي: ${codes[code]} استخدام.` });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});