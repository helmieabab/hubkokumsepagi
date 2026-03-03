<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Log Masuk - E-KOKUM SEPAGI</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #f4f7fe;
      --card-bg: rgba(255, 255, 255, 0.9);
      --text-main: #2b3674;
      --primary: #4318ff;
    }
    body {
      background-color: var(--bg-color);
      font-family: 'Poppins', sans-serif;
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .bg-orb-1 { position: absolute; top: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(67,24,255,0.15) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: -1; }
    .bg-orb-2 { position: absolute; bottom: -150px; right: -50px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,210,255,0.15) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: -1; }
    
    .login-card {
      background: var(--card-bg);
      backdrop-filter: blur(15px);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 15px 40px rgba(67, 24, 255, 0.1);
      border: 1px solid rgba(255,255,255,0.8);
      width: 100%;
      max-width: 400px;
      text-align: center;
      z-index: 1;
    }
    .logo-img { width: 80px; margin-bottom: 20px; }
    .form-control, .form-select {
      border-radius: 12px;
      padding: 12px 15px;
      border: 1px solid #e2e8f0;
      margin-bottom: 15px;
    }
    .form-control:focus, .form-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(67, 24, 255, 0.1);
    }
    .btn-login {
      background: linear-gradient(135deg, #4318ff 0%, #00d2ff 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 12px;
      width: 100%;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(67, 24, 255, 0.2);
    }
    #errorMsg { display: none; color: #ee5d50; font-size: 0.9rem; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="bg-orb-1"></div>
  <div class="bg-orb-2"></div>

  <div class="login-card">
    <img src="https://i.postimg.cc/xJzV4Dfc/logo.png" alt="Logo Sekolah" class="logo-img">
    <h4 class="fw-bold mb-1">E-KOKUM</h4>
    <p class="text-muted small mb-4">Sistem Pengurusan Kokurikulum SK Kepangian</p>

    <select id="role" class="form-select" onchange="togglePassword()">
      <option value="IBUBAPA">Ibu Bapa / Murid</option>
      <option value="GURU">Guru</option>
      <option value="ADMIN">Pentadbir (Admin)</option>
    </select>

    <input type="password" id="pass" class="form-control" placeholder="Kata Laluan" style="display: none;">
    
    <div id="errorMsg">Kata laluan tidak sah. Sila cuba lagi.</div>

    <button class="btn-login" onclick="checkLogin()">Log Masuk</button>
  </div>

  <script>
    // FUNGSI UNTUK PAPAR/SEMBUNYI KATA LALUAN
    function togglePassword() {
      const role = document.getElementById('role').value;
      const passInput = document.getElementById('pass');
      // Sembunyikan ruangan kata laluan jika Ibu Bapa dipilih
      passInput.style.display = (role === 'IBUBAPA') ? 'none' : 'block';
    }

    // FUNGSI PENGESAHAN LOG MASUK
    function checkLogin() {
      const role = document.getElementById('role').value;
      const pass = document.getElementById('pass').value;
      const errorMsg = document.getElementById('errorMsg');
      
      // Sembunyikan mesej ralat jika ada percubaan baru
      if (errorMsg) errorMsg.style.display = 'none';

      if (role === 'ADMIN' && pass === 'Adminsepagi') {
        saveAndRedirect('ADMIN');
      } else if (role === 'GURU' && pass === 'Gurusepagi') {
        saveAndRedirect('GURU');
      } else if (role === 'IBUBAPA') {
        saveAndRedirect('IBUBAPA');
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    }

    // FUNGSI SIMPAN SESI & REDIRECT KE INDEX.HTML (GITHUB)
    function saveAndRedirect(role) {
      // 1. Simpan peranan dalam memori pelayar (Browser Session)
      sessionStorage.setItem("userRole", role);
      
      const btn = document.querySelector('.btn-login');
      if (btn) {
        btn.innerHTML = "Memuatkan...";
        btn.disabled = true;
      }

      // 2. Arahkan pengguna ke Menu Utama (index.html) di GitHub
      // Ini akan buka fail index.html yang kita dah buat tadi
      window.location.href = "index.html"; 
    }
  </script>
</body>
</html>
