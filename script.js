document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/usercount')
        .then(res => res.json())
        .then(data => {
            document.getElementById("usercount").innerText = `عدد اليوزرات المتوفرة: ${data.count}`;
        });

    document.getElementById("submit").onclick = () => {
        const code = document.getElementById("code").value.trim();
        fetch('/api/checkcode', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code})
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("main").style.display = 'none';
                document.getElementById("second").style.display = 'block';
            } else {
                document.getElementById("error").innerText = "❌ الكود غير صالح أو مستخدم بالفعل";
            }
        });
    };

    document.getElementById("getusers").onclick = () => {
        fetch('/api/randomusers')
            .then(res => res.json())
            .then(data => {
                document.getElementById("users").innerText = data.users.join('\n');
            });
    };
});
