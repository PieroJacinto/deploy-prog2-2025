const cloudinary = require('./cloudinary');

/**
 * Extrae el public_id de una URL de Cloudinary
 * Ejemplo: https://res.cloudinary.com/dycu8vsww/image/upload/v1234567890/programacion2/productos/img-123.jpg
 * Retorna: programacion2/productos/img-123
 */
const getPublicIdFromUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // Si es una URL de Cloudinary
    if (imageUrl.includes('cloudinary.com')) {
        try {
            // Extraer el public_id de la URL
            const parts = imageUrl.split('/upload/');
            if (parts.length > 1) {
                // Obtener la parte después de /upload/v1234567890/
                let publicId = parts[1].split('/').slice(1).join('/');
                // Remover la extensión si existe
                publicId = publicId.replace(/\.[^/.]+$/, '');
                return publicId;
            }
        } catch (error) {
            console.error('Error extrayendo public_id:', error);
            return null;
        }
    }

    // Si es una ruta local antigua, retornar null (no se puede eliminar de Cloudinary)
    return null;
};

/**
 * Elimina una imagen de Cloudinary
 * @param {string} imageUrl - URL completa de la imagen en Cloudinary
 * @returns {Promise<Object>} - Resultado de la operación
 */
const deleteImage = async (imageUrl) => {
    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
        console.log('No es una imagen de Cloudinary o public_id inválido:', imageUrl);
        return { success: false, message: 'No es una imagen de Cloudinary' };
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Imagen eliminada de Cloudinary:', result);
        return { success: true, result };
    } catch (error) {
        console.error('Error eliminando imagen de Cloudinary:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Elimina múltiples imágenes de Cloudinary
 * @param {Array<string>} imageUrls - Array de URLs de Cloudinary
 * @returns {Promise<Array>} - Array de resultados
 */
const deleteMultipleImages = async (imageUrls) => {
    const results = [];
    
    for (const url of imageUrls) {
        const result = await deleteImage(url);
        results.push(result);
    }
    
    return results;
};

module.exports = {
    getPublicIdFromUrl,
    deleteImage,
    deleteMultipleImages
};