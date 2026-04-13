// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // <--- NUEVO
const nodemailer = require('nodemailer');

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
            // ¡AQUÍ ESTÁ EL CAMBIO! Agregamos el objeto 'user' en la respuesta
            res.json({ 
                token, 
                msg: 'Usuario registrado exitosamente',
                user: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
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

// --- OLVIDÉ MI CONTRASEÑA (Enviar Correo) ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'No existe una cuenta con ese correo.' });
        }

        // 1. Generar token aleatorio
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // 2. Hashear el token y guardarlo en la base de datos por seguridad
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // Expira en 1 hora (3,600,000 ms)
        await user.save();

        // 3. Configurar la URL de recuperación (Apunta a tu Frontend)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // 4. Configurar Nodemailer (Ejemplo con Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Tu correo
                pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación (App Password)
            }
        });

        // Plantilla HTML profesional
        const emailHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
                .header { background-color: #7c3aed; padding: 30px 20px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
                .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
                .content h2 { color: #1e293b; font-size: 20px; margin-top: 0; }
                .button-container { text-align: center; margin: 35px 0; }
                .button { background-color: #7c3aed; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SelectIA</h1>
                </div>
                <div class="content">
                    <h2>Recuperación de contraseña</h2>
                    <p>Hola,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>SelectIA</strong>. Si fuiste tú, haz clic en el siguiente botón para elegir una nueva contraseña:</p>
                    
                    <div class="button-container">
                        <a href="${resetUrl}" class="button">Restablecer mi contraseña</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b;">
                        <em>Por seguridad, este enlace expirará en 1 hora.</em><br>
                        Si no solicitaste este cambio, simplemente ignora este correo y tu cuenta seguirá segura.
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Innovaciones Pascual S.A. de C.V. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const message = {
            from: `"Equipo SelectIA" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🔒 Restablece tu contraseña - SelectIA',
            html: emailHTML
        };

        await transporter.sendMail(message);
        res.status(200).json({ msg: 'Instrucciones enviadas al correo exitosamente.' });

    } catch (error) {
        console.error(error);
        // Si hay error al enviar el correo, limpiamos los campos en la BD
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).json({ msg: 'Error enviando el correo. Intenta de nuevo más tarde.' });
    }
};

// --- RESTABLECER CONTRASEÑA (Guardar la nueva) ---
exports.resetPassword = async (req, res) => {
    try {
        // 1. Obtener el token de la URL y hashearlo para compararlo con el de la BD
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // 2. Buscar al usuario con ese token y que no haya expirado
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt significa "greater than" (mayor que ahora)
        });

        if (!user) {
            return res.status(400).json({ msg: 'El token es inválido o ha expirado.' });
        }

        // 3. Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // 4. Limpiar los campos del token (ya no se necesitan)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ msg: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al restablecer la contraseña.' });
    }
};