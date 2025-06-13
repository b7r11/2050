document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit");
  const codeInput = document.getElementById("code");
  const errorDiv = document.getElementById("error");
  const mainDiv = document.getElementById("main");
  const secondDiv = document.getElementById("second");
  const getUsersBtn = document.getElementById("getusers");
  const usersDiv = document.getElementById("users");
  const userCountDiv = document.getElementById("usercount");

  let users = [];

  async function loadUsers() {
    try {
      const response = await fetch('users.json');
      users = await response.json();
      userCountDiv.textContent = `عدد اليوزرات المتوفرة: ${users.length}`;
    } catch (e) {
      errorDiv.textContent = "حدث خطأ في تحميل بيانات اليوزرات.";
    }
  }

  submitBtn.addEventListener("click", async () => {
    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
      errorDiv.textContent = "الرجاء إدخال كود صالح.";
      return;
    }

    try {
      const response = await fetch('/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const result = await response.json();

      if (result.success) {
        errorDiv.textContent = "";
        mainDiv.style.display = "none";
        secondDiv.style.display = "block";
      } else {
        errorDiv.textContent = result.message;
      }
    } catch (e) {
      errorDiv.textContent = "حدث خطأ أثناء التحقق من الكود.";
    }
  });

  getUsersBtn.addEventListener("click", () => {
    if (users.length === 0) {
      usersDiv.textContent = "لا توجد يوزرات متوفرة حالياً.";
      return;
    }

    const count = Math.min(20, users.length);
    let selected = [];

    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * users.length);
      selected.push(users[idx]);
      users.splice(idx, 1);
    }

    usersDiv.textContent = selected.join("\n");
    userCountDiv.textContent = `عدد اليوزرات المتوفرة: ${users.length}`;
  });

  loadUsers();
});