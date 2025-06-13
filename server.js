const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// قراءة ملفات JSON
function readJSON(file) {
    return JSON.parse(fs.readFileSync(`${__dirname}/${file}`));
}

// كتابة ملفات JSON
function writeJSON(file, data) {
    fs.writeFileSync(`${__dirname}/${file}`, JSON.stringify(data, null, 2));
}

// API: جلب عدد المستخدمين
app.get('/api/usercount', (req, res) => {
    const users = readJSON('users.json');
    res.json({ count: users.length });
});

// API: تحقق من الكود
app.post('/api/checkcode', (req, res) => {
    const { code } = req.body;
    let codes = readJSON('codes.json');
    if (codes.includes(code)) {
        // حذف الكود
        codes = codes.filter(c => c !== code);
        writeJSON('codes.json', codes);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// API: جلب 20 مستخدم عشوائي
app.get('/api/randomusers', (req, res) => {
    const users = readJSON('users.json');
    const shuffled = users.sort(() => 0.5 - Math.random());
    res.json({ users: shuffled.slice(0, 20) });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
