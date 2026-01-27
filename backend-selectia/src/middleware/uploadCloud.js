// backend-selectia/src/middleware/uploadCloud.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuración del Almacenamiento
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'selectia_uploads', // Nombre de la carpeta en tu nube
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Formatos permitidos
        // public_id: (req, file) => 'custom_name', // Opcional: renombrar archivo
    },
});

// 3. Crear el middleware
const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;