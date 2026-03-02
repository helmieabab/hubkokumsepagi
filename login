<script>
  // KEMASKINI: Masukkan URL Web App GAS Cikgu yang sebenar di sini
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz5_Cby8cVAZtkEs4rYPcLhk3tGn-FeHvqVUYUle2s6HTy8tOuDlppRIJQGVllLY2oUiA/exec";

  function togglePassword() {
    const role = document.getElementById('role').value;
    const passInput = document.getElementById('pass');
    passInput.style.display = (role === 'IBUBAPA') ? 'none' : 'block';
  }

  function checkLogin() {
    const role = document.getElementById('role').value;
    const pass = document.getElementById('pass').value;
    
    // Sembunyikan mesej ralat jika ada percubaan baru
    document.getElementById('errorMsg').style.display = 'none';

    if (role === 'ADMIN' && pass === 'Adminsepagi') {
      saveAndRedirect('ADMIN');
    } else if (role === 'GURU' && pass === 'Gurusepagi') {
      saveAndRedirect('GURU');
    } else if (role === 'IBUBAPA') {
      saveAndRedirect('IBUBAPA');
    } else {
      document.getElementById('errorMsg').style.display = 'block';
    }
  }

  function saveAndRedirect(role) {
    // Simpan peranan dalam sessionStorage untuk kegunaan di browser
    sessionStorage.setItem("userRole", role);
    
    const btn = document.querySelector('.btn-login');
    btn.innerHTML = "Menyemak...";
    btn.disabled = true;

    // REDIRECT: Kita hantar user terus ke Web App GAS Cikgu
    // Kita hantar parameter 'page=Dashboard' (atau 'Index' ikut kod Cikgu) dan 'role'
    // Menggunakan window.top.location supaya ia keluar daripada frame GitHub/Vercel dengan bersih
    window.top.location.href = WEB_APP_URL + "?page=Dashboard&role=" + role;
  }
</script>
