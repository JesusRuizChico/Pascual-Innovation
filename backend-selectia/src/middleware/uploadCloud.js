const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Limpiamos el nombre de caracteres raros (esto está perfecto, lo conservamos)
        const cleanName = file.originalname
            .split('.')[0]
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "_");

        return {
            folder: 'selectia_uploads', // Se guardará en la misma carpeta de tu Cloudinary
            
            // --- CORRECCIONES PARA IMÁGENES ---
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Solo permite imágenes
            resource_type: 'image', // Le dice a Cloudinary que es una imagen, no un archivo crudo
            public_id: `${cleanName}-${Date.now()}` // Quitamos el .pdf (Cloudinary le pondrá la extensión correcta automáticamente)
        };
    },
});

const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud;