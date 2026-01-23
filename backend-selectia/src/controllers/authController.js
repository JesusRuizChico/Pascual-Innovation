// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// --- REGISTRAR USUARIO ---
exports.register = async (req, res) => {
    try {
        const { name, lastname, email, password, role, companyName, rfc } = req.body;

        // 1. Validar que el usuario no exista
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe con este correo' });
        }

        // 2. Crear el objeto de usuario
        user = new User({
            name,
            lastname,
            email,
            password,
            role,
            companyName: role === 'recruiter' ? companyName : undefined,
            rfc: role === 'recruiter' ? rfc : undefined
        });

        // 3. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Guardar en base de datos
        await user.save();

        // 5. Crear Token (JWT) para que inicie sesión automáticamente
        const payload = {
            user: { id: user.id, role: user.role }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, msg: 'Usuario registrado exitosamente' });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

// --- INICIAR SESIÓN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si existe el usuario
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas (Email no encontrado)' });
        }

        // 2. Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas (Contraseña incorrecta)' });
        }

        // 3. Retornar Token y Datos del usuario (Para el frontend)
        const payload = {
            user: { id: user.id, role: user.role }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email
                }
            });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // 1. Buscar usuario
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // 2. Verificar contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
        }

        // 3. Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ msg: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// ... al final del archivo ...

// --- ELIMINAR CUENTA PERMANENTEMENTE ---
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Eliminar perfil de candidato (si existe)
        const Candidate = require('../models/Candidate');
        await Candidate.findOneAndDelete({ user: userId });

        // 2. Eliminar postulaciones (Opcional: o mantenerlas como "Usuario Eliminado")
        const Application = require('../models/Application');
        // await Application.deleteMany({ user: userId }); // Descomentar si quieres borrar historial

        // 3. Eliminar Usuario
        await User.findByIdAndDelete(userId);

        res.json({ msg: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar cuenta');
    }
};