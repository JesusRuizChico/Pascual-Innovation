// backend-selectia/src/index.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // <--- 1. IMPORTANTE: Agrega esto arriba
const adminRoutes = require('./routes/adminRoutes');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();

// Conectar a la Base de Datos
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Solución para Express 5: req.query es de solo lectura, por lo que express-mongo-sanitize falla al intentar reasignarlo.
// Saneamos body y params manualmente usando la función interna de la librería.
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    if (req.query) {
        for (let key in req.query) {
            req.query[key] = mongoSanitize.sanitize(req.query[key]);
        }
    }
    next();
});

// --- 2. IMPORTANTE: HACER PÚBLICA LA CARPETA UPLOADS ---
// Esto traduce la URL "localhost:4000/uploads" a la carpeta física en tu compu
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vacancies', require('./routes/vacancyRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
// ...
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// NUEVA RUTA
app.use('/api/recruiters', require('./routes/recruiterRoutes')); 
// ...
app.use('/api/admin', adminRoutes);

// Error Handler (siempre al final de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});