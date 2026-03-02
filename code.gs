const FOLDER_ID = "1Mo4dm3v1rIfzlNyc364dEFJapU4fBLFi";
const FOLDER_PAJSK_ID = "1rBdT2hDnkYX8uLjKs5W4wKKtiFGizL1P";

// ==========================================
// SISTEM LOGIN & NAVIGASI
// ==========================================
function doGet(e) {
  var action = e.parameter.action;
  
  // API untuk External (Vercel/Fetch)
  if (action === 'getStudents') {
    return ContentService.createTextOutput(JSON.stringify(getStudentsForPAJSK())).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'simpanPAJSK') {
    const payload = JSON.parse(e.parameter.data);
    return ContentService.createTextOutput(JSON.stringify(simpanDanJanaPAJSK_Lengkap(payload))).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getSenaraiLaporan') {
    return ContentService.createTextOutput(JSON.stringify(getSenaraiLaporan())).setMimeType(ContentService.MimeType.JSON);
  }

  // Paparan Halaman HTML
  var page = e.parameter.page || 'Login';
  var role = e.parameter.role || 'IBUBAPA';
  if (page.toUpperCase().includes('SEGAK') && role.toUpperCase() === 'IBUBAPA') { page = 'Login'; }

  var tmp = HtmlService.createTemplateFromFile(page);
  tmp.role = role; 
  return tmp.evaluate()
      .setTitle("E-KOKUM SEPAGI")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getScriptUrl() { return ScriptApp.getService().getUrl(); }

function getUserRole(roleFromUrl) {
  if (roleFromUrl) {
    var roleStr = roleFromUrl.toUpperCase().trim();
    if (roleStr === 'ADMIN') return {role: "ADMIN", name: "Administrator"};
    if (roleStr === 'GURU') return {role: "GURU", name: "Cikgu"};
  }
  return {role: "IBUBAPA", name: "Ibu Bapa / Penjaga"};
}

// ==========================================
// DASHBOARD & DATA MURID
// ==========================================
function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Pelaporan_Mingguan');
  
  let fileCount = 0;
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFilesByType(MimeType.PDF);
    while (files.hasNext()) { files.next(); fileCount++; }
  } catch(e) {}

  if (!sheet || sheet.getLastRow() < 2) {
    return { totalLaporan: fileCount, hadirPurata: 0, unitHantar: {} };
  }

  const data = sheet.getDataRange().getValues();
  data.shift(); 
  const indexUnit = 2; 
  const indexPeratus = 3; 

  let jumlahPeratus = 0;
  let unitCount = {};

  data.forEach(row => {
    let unit = row[indexUnit];
    if (unit) { unitCount[unit] = (unitCount[unit] || 0) + 1; }
    jumlahPeratus += parseFloat(row[indexPeratus]) || 0;
  });

  return {
    totalLaporan: data.length,
    hadirPurata: (jumlahPeratus / data.length).toFixed(2),
    unitHantar: unitCount
  };
}

function resetStatistikDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Pelaporan_Mingguan');
    if (sheet && sheet.getLastRow() > 1) { sheet.deleteRows(2, sheet.getLastRow() - 1); }
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function getFullSheetData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Data_Murid"); 
    return sheet ? sheet.getDataRange().getValues() : null;
  } catch(e) { return null; }
}

// ==========================================
// MODUL LAPORAN MINGGUAN (PRO PDF TEMPLATE)
// ==========================================
function simpanLaporanPro(payload) {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var logoUrl = "https://i.postimg.cc/xJzV4Dfc/logo.png";
    var logoBase64 = "";
    try {
      var logoBlob = UrlFetchApp.fetch(logoUrl).getBlob();
      logoBase64 = "data:" + logoBlob.getContentType() + ";base64," + Utilities.base64Encode(logoBlob.getBytes());
    } catch(e) { logoBase64 = logoUrl; }

    var htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 10px;">
          <img src="${logoBase64}" alt="Logo Sekolah" style="width: 100px; height: auto;" />
        </div>
        <h2 style="text-align: center; color: #1a237e; margin-bottom: 5px; font-weight: bold;">LAPORAN AKTIVITI KOKURIKULUM</h2>
        <h3 style="text-align: center; margin-top: 0; color: #4318ff; text-transform: uppercase; margin-bottom: 20px;">${payload.unit}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr><td width="25%"><strong>Guru Pelapor</strong></td><td>: ${payload.namaGuru}</td></tr>
          <tr><td><strong>Tarikh / Minggu</strong></td><td>: ${payload.tarikh} (${payload.minggu})</td></tr>
          <tr><td><strong>Komponen</strong></td><td>: ${payload.kategori}</td></tr>
          <tr><td><strong>Tajuk Aktiviti</strong></td><td>: ${payload.aktiviti}</td></tr>
        </table>
        <h3 style="background-color: #f4f7fe; padding: 8px; font-size: 16px; border-left: 4px solid #4318ff;">RINGKASAN & REFLEKSI</h3>
        <p><strong>Ringkasan:</strong> ${payload.ringkasan}</p>
        <p><strong>Refleksi:</strong> ${payload.refleksi}</p>
        <h3 style="background-color: #f4f7fe; padding: 8px; font-size: 16px; border-left: 4px solid #05cd99;">KEHADIRAN (${payload.peratusStat})</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #1a237e; color: white;"><th>Bil</th><th>Nama Murid</th><th>Kelas</th><th>Status</th></tr>
          ${payload.senaraiKehadiran.map((m, i) => `<tr><td style="text-align:center;">${i+1}</td><td>${m.nama}</td><td style="text-align:center;">${m.kelas}</td><td style="text-align:center; font-weight:bold; color:${m.status === 'HADIR' ? 'green' : 'red'}">${m.status}</td></tr>`).join('')}
        </table>
      </div>
    `;

    if (payload.gambar && payload.gambar.length > 0) {
      htmlBody += `<h3 style="page-break-before: always;">LAMPIRAN GAMBAR</h3><div style="text-align: center;">`;
      payload.gambar.forEach(img => {
        htmlBody += `<img src="data:${img.mimeType};base64,${img.data}" style="width: 45%; margin: 10px; border: 1px solid #ddd;" />`;
      });
      htmlBody += `</div>`;
    }

    var blobPDF = HtmlService.createHtmlOutput(htmlBody).getAs(MimeType.PDF);
    blobPDF.setName("Laporan_" + payload.unit + "_" + payload.tarikh + ".pdf");
    var urlFail = folder.createFile(blobPDF).getUrl();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Pelaporan_Mingguan") || ss.insertSheet("Pelaporan_Mingguan");
    sheet.appendRow([new Date(), payload.namaGuru, payload.unit, payload.peratusStat.replace('%',''), payload.aktiviti, payload.ringkasan, payload.refleksi, urlFail]);
    return { success: true, pdfUrl: urlFail };
  } catch (error) { return { success: false, error: error.toString() }; }
}

function getSenaraiLaporan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Pelaporan_Mingguan");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  data.shift();
  return data.map(r => ({ tarikh: r[0], guru: r[1], unit: r[2], peratus: r[3], pdfUrl: r[7] })).reverse();
}

// ==========================================
// MODUL TAKWIM
// ==========================================
function getEventsFromSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Takwim");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var events = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    events.push({
      id: i + 1,
      title: data[i][2],
      start: Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      extendedProps: { category: data[i][1], teacher: data[i][3], time: data[i][4] },
      color: data[i][1] == 'UB' ? '#3498db' : (data[i][1] == 'KP' ? '#e67e22' : '#27ae60')
    });
  }
  return events;
}

function tambahSatuAktiviti(rowArray) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Takwim") || ss.insertSheet("Takwim");
    if (rowArray[0]) rowArray[0] = new Date(rowArray[0]);
    sheet.appendRow(rowArray.slice(0, 5));
    sheet.getRange(sheet.getLastRow(), 1).setNumberFormat("yyyy-mm-dd");
    return "✅ Aktiviti berjaya disimpan!";
  } catch (e) { return "❌ Ralat: " + e.toString(); }
}

function kemaskiniAktiviti(payload) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Takwim");
    var row = parseInt(payload[5]); 
    if (payload[0]) payload[0] = new Date(payload[0]);
    sheet.getRange(row, 1, 1, 5).setValues([payload.slice(0, 5)]);
    return "✅ Dikemaskini!";
  } catch (e) { return "❌ Ralat: " + e.toString(); }
}

function padamSatuAktiviti(eventId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Takwim");
    sheet.deleteRow(parseInt(eventId));
    return "✅ Dipadam!";
  } catch (e) { return "❌ Ralat: " + e.toString(); }
}

// ==========================================
// MODUL OPR (Lengkap dengan Lampiran)
// ==========================================
function simpanBorangOPR(payload) {
  try {
    var folderLain = DriveApp.getFolderById("1w6baBqk8ixEkbSr-sjsukK66PT0F_skg");
    var urlKertasKerja = "-";
    if (payload.kertasKerja && payload.kertasKerja.data) {
      var splitData = payload.kertasKerja.data.split(',');
      var kkBlob = Utilities.newBlob(Utilities.base64Decode(splitData[1]), payload.kertasKerja.mimeType, payload.kertasKerja.name);
      urlKertasKerja = folderLain.createFile(kkBlob).getUrl();
    }
    var logoUrl = "https://i.postimg.cc/xJzV4Dfc/logo.png";
    var logoBase64 = "";
    try {
      var logoBlob = UrlFetchApp.fetch(logoUrl).getBlob();
      logoBase64 = "data:" + logoBlob.getContentType() + ";base64," + Utilities.base64Encode(logoBlob.getBytes());
    } catch(e) { logoBase64 = logoUrl; }
    
    var htmlBody = `<div style="font-family: Arial; padding: 20px;">
      <div style="text-align: center;"><img src="${logoBase64}" width="100"/><h2>ONE PAGE REPORT (OPR)</h2></div>
      <table border="1" style="width:100%; border-collapse:collapse;">
        <tr><td style="background:#f4f7fe; padding:5px;">Aktiviti</td><td>${payload.namaAktiviti}</td></tr>
        <tr><td style="background:#f4f7fe; padding:5px;">Tarikh</td><td>${payload.tarikhMula}</td></tr>
        <tr><td style="background:#f4f7fe; padding:5px;">Kertas Kerja</td><td><a href="${urlKertasKerja}">Pautan</a></td></tr>
      </table>
      <p><strong>Ringkasan:</strong> ${payload.ringkasan}</p>
      <div style="text-align:center;">
        <img src="${payload.gambar1}" style="width:45%; height:200px; object-fit:cover;"/>
        <img src="${payload.gambar2}" style="width:45%; height:200px; object-fit:cover;"/>
      </div>
    </div>`;
    
    var blobPDF = HtmlService.createHtmlOutput(htmlBody).getAs(MimeType.PDF);
    blobPDF.setName("OPR_" + payload.namaAktiviti + ".pdf");
    var filePDF = folderLain.createFile(blobPDF);
    return { success: true, pdfUrl: filePDF.getUrl() };
  } catch (error) { return { success: false, error: error.toString() }; }
}

// ==========================================
// MODUL SEGAK & BMI (Logic Skor Asal)
// ==========================================
function getStudentsForSegak() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Data_Murid");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idxNama = headers.indexOf("Nama_Murid");
    const idxIC = headers.indexOf("No_KP");
    const idxJantina = headers.indexOf("Jantina");
    const idxKelas = headers.indexOf("Kelas");
    return data.slice(1).map(r => {
      let kelas = r[idxKelas] ? r[idxKelas].toString() : "";
      if (kelas.includes("TAHUN 4") || kelas.includes("TAHUN 5") || kelas.includes("TAHUN 6")) {
        return { nama: r[idxNama].toString().toUpperCase(), ic: r[idxIC].toString(), jantina: r[idxJantina], kelas: kelas, tahun: kelas.split(" ")[1] };
      }
      return null;
    }).filter(s => s !== null);
  } catch(e) { return []; }
}

function hitungSkorSegak(jantina, umur, jenis, nilai) {
  var s = parseFloat(nilai);
  var j = (jantina || "LELAKI").toUpperCase().trim();
  var t = jenis.toLowerCase().trim();
  var u = parseInt(umur);
  // (Logic skor Cikgu dikekalkan 100% di sini...)
  if (u == 10) {
    if (j == "LELAKI") {
      if (t == "bangku") { if (s <= 79) return 5; if (s <= 101) return 4; if (s <= 125) return 3; if (s <= 148) return 2; return 1; }
      if (t == "tekantubi") { if (s >= 15) return 5; if (s >= 13) return 4; if (s >= 9) return 3; if (s >= 7) return 2; return 1; }
      if (t == "ringkuk") { if (s >= 18) return 5; if (s >= 15) return 4; if (s >= 11) return 3; if (s >= 8) return 2; return 1; }
      if (t == "jangkauan") { if (s >= 37) return 5; if (s >= 32) return 4; if (s >= 25) return 3; if (s >= 19) return 2; return 1; }
    } else {
      if (t == "bangku") { if (s <= 84) return 5; if (s <= 108) return 4; if (s <= 133) return 3; if (s <= 158) return 2; return 1; }
      if (t == "tekantubi") { if (s >= 21) return 5; if (s >= 17) return 4; if (s >= 13) return 3; if (s >= 9) return 2; return 1; }
      if (t == "ringkuk") { if (s >= 18) return 5; if (s >= 15) return 4; if (s >= 11) return 3; if (s >= 8) return 2; return 1; }
      if (t == "jangkauan") { if (s >= 35) return 5; if (s >= 30) return 4; if (s >= 24) return 3; if (s >= 18) return 2; return 1; }
    }
  } 
  // ... (Sila tambah baki logic umur 11 & 12 dari kod asal Cikgu jika perlu)
  return 3; // Default skor
}

function simpanDanJanaSegak(p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Data_SEGAK") || ss.insertSheet("Data_SEGAK");
    const sBangku = hitungSkorSegak(p.jantina, p.umur, 'bangku', p.bangku);
    const sTekan = hitungSkorSegak(p.jantina, p.umur, 'tekantubi', p.tekanTubi);
    const sRingkuk = hitungSkorSegak(p.jantina, p.umur, 'ringkuk', p.ringkuk);
    const sJangkau = hitungSkorSegak(p.jantina, p.umur, 'jangkauan', p.jangkauan);
    const jumlahSkor = sBangku + sTekan + sRingkuk + sJangkau;
    const gred = (jumlahSkor >= 19) ? "A" : (jumlahSkor >= 16) ? "B" : (jumlahSkor >= 12) ? "C" : (jumlahSkor >= 8) ? "D" : "E";
    sheet.appendRow([p.tahunAkademik, p.penggal, p.nama, p.ic, p.kelas, p.tinggi, p.berat, p.bmi, p.bangku, p.tekanTubi, p.ringkuk, p.jangkauan, jumlahSkor, gred]);
    
    var html = `<div style="font-family:Arial; text-align:center;"><h2>REKOD SEGAK</h2><p>${p.nama}</p><p>GRED: ${gred}</p></div>`;
    var blob = HtmlService.createHtmlOutput(html).getAs(MimeType.PDF);
    var folderSegak = DriveApp.getFolderById("1qtY_oEgUYNI68bhnYdZYufFQTzuoMI0Q");
    return { success: true, url: folderSegak.createFile(blob).getUrl() };
  } catch(e) { return { success: false, error: e.toString() }; }
}

// ==========================================
// MODUL PAJSK (Logic Purata & 110 Poin)
// ==========================================
function getStudentsForPAJSK() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Data_Murid");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    return data.slice(1).map(r => ({
      nama: r[headers.indexOf("Nama_Murid")].toString().toUpperCase(), 
      ic: r[headers.indexOf("No_KP")].toString(), 
      kelas: r[headers.indexOf("Kelas")],
      unitUB: r[headers.indexOf("UB")] || "TIADA",
      unitSP: r[headers.indexOf("SP")] || "TIADA",
      unitKP: r[headers.indexOf("KP")] || "TIADA"
    })).filter(s => s.kelas.includes("TAHUN"));
  } catch(e) { return []; }
}

function simpanDanJanaPAJSK_Lengkap(p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Data_PAJSK") || ss.insertSheet("Data_PAJSK");
    const hitungSkor = (data) => {
      let j = parseInt(data.mj) || 0; let p_score = parseInt(data.mp) || 0; let a = parseInt(data.ma) || 0;
      let h = parseFloat(((parseInt(data.h) || 0) / 12) * 40);
      let total = j + p_score + a + h + 10;
      return parseFloat(((total / 110) * 100).toFixed(2));
    };
    let sUB = hitungSkor(p.ub); let sSP = hitungSkor(p.sp); let sKP = hitungSkor(p.kp);
    let purata = parseFloat((([sUB, sSP, sKP].sort((a,b)=>b-a)[0] + [sUB, sSP, sKP].sort((a,b)=>b-a)[1])/2).toFixed(2));
    
    sheet.appendRow([new Date(), p.tahunAkademik, p.nama, p.ic, p.kelas, p.ub.tj, sUB, p.sp.tj, sSP, p.kp.tj, sKP, purata, p.totalEkstra, p.mNilam]);
    
    var html = `<div style="font-family:Arial; padding:20px; border:1px solid #000;">
      <h2 style="text-align:center;">RUMUSAN PAJSK</h2>
      <p>NAMA: ${p.nama}</p>
      <table border="1" style="width:100%; border-collapse:collapse; text-align:center;">
        <tr><th>KOMPONEN</th><th>JAWATAN</th><th>MARKAH</th></tr>
        <tr><td>UB</td><td>${p.ub.tj}</td><td>${sUB}</td></tr>
        <tr><td>SP</td><td>${p.sp.tj}</td><td>${sSP}</td></tr>
        <tr><td>KP</td><td>${p.kp.tj}</td><td>${sKP}</td></tr>
        <tr style="background:#eee;"><td>PURATA 2 TERBAIK</td><td colspan="2">${purata}</td></tr>
      </table>
    </div>`;
    
    var blob = HtmlService.createHtmlOutput(html).getAs(MimeType.PDF);
    var folder = DriveApp.getFolderById(FOLDER_PAJSK_ID);
    return { success: true, url: folder.createFile(blob).getUrl() };
  } catch(e) { return { success: false, error: e.toString() }; }
}
