// backend-selectia/src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Leer el token del header
    const token = req.header('x-auth-token');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    // 3. Validar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Agregamos el usuario a la petición
        next(); // Pasamos al siguiente controlador
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};