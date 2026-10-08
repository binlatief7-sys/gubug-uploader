const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GUBUG UPLOADER</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#0b0f14;
  color:white;
}
.container{
  max-width:600px;
  margin:auto;
  padding:20px;
}
h1{
  text-align:center;
  margin-bottom:5px;
}
.subtitle{
  text-align:center;
  color:#9ca3af;
  margin-bottom:25px;
}
.card{
  background:#151b23;
  border-radius:18px;
  padding:20px;
  margin-bottom:16px;
}
input[type=file],textarea{
  width:100%;
  margin-top:10px;
}
textarea{
  min-height:100px;
  padding:12px;
  border-radius:10px;
  background:#0d131a;
  color:white;
  border:1px solid #303944;
}
.platform{
  display:block;
  padding:14px;
  margin:8px 0;
  background:#0d131a;
  border-radius:10px;
}
button{
  width:100%;
  padding:16px;
  border:0;
  border-radius:12px;
  background:#16a34a;
  color:white;
  font-size:17px;
  font-weight:bold;
}
button:disabled{
  opacity:.5;
}
#status{
  margin-top:15px;
  line-height:1.8;
}
</style>
</head>

<body>
<div class="container">

<h1>🚀 GUBUG UPLOADER</h1>
<div class="subtitle">Upload sekali, siapkan untuk banyak platform</div>

<div class="card">
  <b>🎬 Pilih Video</b>
  <input id="video" type="file" accept="video/*">
</div>

<div class="card">
  <b>📝 Caption</b>
  <textarea id="caption" placeholder="Tulis caption video..."></textarea>
</div>

<div class="card">
  <b>📱 Pilih Platform</b>

  <label class="platform">
    <input type="checkbox" value="facebook"> Facebook
  </label>

  <label class="platform">
    <input type="checkbox" value="instagram"> Instagram
  </label>

  <label class="platform">
    <input type="checkbox" value="youtube"> YouTube Shorts
  </label>

  <label class="platform">
    <input type="checkbox" value="tiktok"> TikTok
  </label>

  <label class="platform">
    <input type="checkbox" value="bilibili"> Bilibili
  </label>
</div>

<div class="card">
  <button id="uploadBtn" onclick="uploadVideo()">
    🚀 UPLOAD SEMUA
  </button>

  <div id="status"></div>
</div>

</div>

<script>
async function uploadVideo(){

  const video = document.getElementById("video").files[0];
  const caption = document.getElementById("caption").value;

  const platforms = [...document.querySelectorAll(
    'input[type="checkbox"]:checked'
  )].map(x => x.value);

  const status = document.getElementById("status");
  const button = document.getElementById("uploadBtn");

  if(!video){
    status.innerHTML = "⚠️ Silakan pilih video terlebih dahulu.";
    return;
  }

  if(platforms.length === 0){
    status.innerHTML = "⚠️ Pilih minimal satu platform.";
    return;
  }

  button.disabled = true;
  status.innerHTML = "⏳ Mengunggah video...";

  const formData = new FormData();
  formData.append("video", video);
  formData.append("caption", caption);
  formData.append("platforms", JSON.stringify(platforms));

  try{

    const response = await fetch("/upload", {
      method:"POST",
      body:formData
    });

    const result = await response.json();

    if(result.success){

      status.innerHTML =
        "✅ Video berhasil diterima GUBUG UPLOADER!<br><br>" +
        platforms.map(p => "⏳ " + p.toUpperCase() +
        " — menunggu koneksi API").join("<br>");

    }else{
      status.innerHTML = "❌ " + result.message;
    }

  }catch(error){

    status.innerHTML =
      "❌ Terjadi kesalahan: " + error.message;

  }

  button.disabled = false;
}
</script>

</body>
</html>
  `);
});

app.post("/upload", upload.single("video"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Video belum dipilih."
    });
  }

  let platforms = [];

  try {
    platforms = JSON.parse(req.body.platforms || "[]");
  } catch {
    platforms = [];
  }

  console.log("Video diterima:");
  console.log("Nama:", req.file.originalname);
  console.log("Ukuran:", req.file.size);
  console.log("Platform:", platforms);
  console.log("Caption:", req.body.caption);

  res.json({
    success: true,
    message: "Video berhasil diterima.",
    filename: req.file.originalname,
    platforms
  });
});

app.listen(PORT, () => {
  console.log("GUBUG UPLOADER berjalan di port " + PORT);
});
