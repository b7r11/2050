document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit");
  const codeInput = document.getElementById("code");
  const errorDiv = document.getElementById("error");
  const mainDiv = document.getElementById("main");
  const secondDiv = document.getElementById("second");
  const getUsersBtn = document.getElementById("getusers");
  const usersDiv = document.getElementById("users");
  const userCountDiv = document.getElementById("usercount");

  let codes = {};
  let users = [];

  async function loadData() {
    try {
      const codesResponse = await fetch('codes.json');
      codes = await codesResponse.json();

      const usersResponse = await fetch('users.json');
      users = await usersResponse.json();

      updateUserCount();
    } catch (e) {
      errorDiv.textContent = "حدث خطأ في تحميل البيانات.";
      console.error(e);
    }
  }

  function updateUserCount() {
    userCountDiv.textContent = `عدد اليوزرات المتوفرة: ${users.length}`;
  }

  submitBtn.addEventListener("click", () => {
    const code = codeInput.value.trim().toUpperCase();

    if (!code) {
      errorDiv.textContent = "الرجاء إدخال كود صالح.";
      return;
    }

    if (!(code in codes)) {
      errorDiv.textContent = "الكود غير صحيح أو غير موجود.";
      return;
    }

    if (!codes[code]) {
      errorDiv.textContent = "تم استخدام هذا الكود من قبل.";
      return;
    }

    errorDiv.textContent = "";
    codes[code] = false;

    mainDiv.style.display = "none";
    secondDiv.style.display = "block";
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
    updateUserCount();
  });

  loadData();
});