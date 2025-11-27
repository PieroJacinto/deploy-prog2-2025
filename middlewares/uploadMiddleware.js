const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const getFolder = (req) => {
    if (req.baseUrl.includes('productos')) {
        return 'programacion2/productos';
    } else if (req.baseUrl.includes('usuarios')) {
        return 'programacion2/usuarios';
    }
    return 'programacion2/otros';
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname).substring(1);
        
        return {
            folder: getFolder(req),
            format: extension,
            public_id: `${file.fieldname}-${timestamp}`,
            resource_type: 'image'
        };
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    }
});

module.exports = upload;