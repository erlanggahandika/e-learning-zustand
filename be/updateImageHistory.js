const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "imageHistory.json");

function updateImageHistory(containerName, imageTag) {
  let history = {};

  if (fs.existsSync(filePath)) {
    try {
      history = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (e) {
      console.error("❌ Failed to parse imageHistory.json:", e);
    }
  }

  if (!history[containerName]) {
    history[containerName] = [];
  }

  // Hapus duplikat
  history[containerName] = history[containerName].filter((tag) => tag !== imageTag);
  // Tambahkan yang baru di atas
  history[containerName].unshift(imageTag);

  // Simpan
  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
  } catch (e) {
    console.error("❌ Failed to write imageHistory.json:", e);
  }
}

module.exports = { updateImageHistory };
