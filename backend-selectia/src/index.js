// backend-selectia/src/index.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // <--- 1. IMPORTANTE: Agrega esto arriba

require('dotenv').config();

const app = express();

// Conectar a la Base de Datos
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

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

// ...
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// NUEVA RUTA
app.use('/api/recruiters', require('./routes/recruiterRoutes')); 
// ...


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});