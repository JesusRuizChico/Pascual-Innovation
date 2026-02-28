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
        // Limpiamos el nombre de caracteres raros
        const cleanName = file.originalname
            .split('.')[0]
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "_");

        return {
            folder: 'selectia_uploads',
            // OBLIGATORIO: Guardar como 'raw' para que el PDF no se rompa
            resource_type: 'raw', 
            // OBLIGATORIO: Poner .pdf manualmente al final del nombre
            public_id: `${cleanName}-${Date.now()}.pdf`,
            format: undefined
        };
    },
});

const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud;