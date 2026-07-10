const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('name').trim().notEmpty().withMessage('El nombre es requerido').escape(),
    body('lastname').trim().notEmpty().withMessage('El apellido es requerido').escape(),
    body('email').isEmail().withMessage('El correo electrónico no es válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('El correo electrónico no es válido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es requerida').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRegister,
    validateLogin
};
