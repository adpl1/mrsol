// app.js
const auth = firebase.auth();
const db   = firebase.firestore();
const rdb  = firebase.database();
const stor = firebase.storage();

// حماية الصفحات المحمية
if (document.querySelector('.requires-auth')) {
  auth.onAuthStateChanged(u => { if (!u) location.href = 'login.html'; });
}

// تسجيل الدخول
if (document.getElementById('loginBtn')) {
  document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const pass  = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => location.href = 'home.html')
      .catch(e => {
        alert(e.message);
      });
  });
}

// إنشاء الحساب
if (document.getElementById('signupBtn')) {
  document.getElementById('signupBtn').addEventListener('click', () => {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const pass    = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    if (!name||!email||!phone||!pass||pass !== confirm) {
      return alert('تأكد من تعبئة جميع الحقول ومطابقة كلمة المرور');
    }
    auth.createUserWithEmailAndPassword(email, pass)
      .then(({ user }) => rdb.ref('users/'+user.uid).set({ name,email,phone }))
      .then(() => location.href = 'login.html')
      .catch(e => alert(e.message));
  });
}

// الصفحة الرئيسية
if (document.getElementById('placeOrderBtn')) {
  // مثال: إضافة الكود الخاص بالصفحة الرئيسية هنا
}

// صفحة الحساب
if (document.querySelector('.account-page')) {
  const uiName  = document.getElementById('userName');
  const uiEmail = document.getElementById('userEmail');
  const uiPhone = document.getElementById('userPhone');

  auth.onAuthStateChanged(u => {
    if (!u) return;
    rdb.ref('users/'+u.uid).once('value').then(snap => {
      const d = snap.val()||{};
      uiName.textContent  = d.name || '';
      uiEmail.textContent = d.email||'';
      uiPhone.textContent = d.phone||'';
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => location.href='login.html');
  });
}
