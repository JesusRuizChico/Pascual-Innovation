const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acceso denegado: No tienes el rango requerido' });
        }
        next();
    };
};

module.exports = checkRole;
