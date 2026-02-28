// backend-selectia/src/middleware/uploadBuffer.js
const multer = require('multer');

// Usamos memoryStorage: El archivo se queda en la RAM un momento
const storage = multer.memoryStorage();

const uploadBuffer = multer({ storage: storage });

module.exports = uploadBuffer;