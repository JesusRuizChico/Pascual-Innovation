const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Candidate = require('../models/Candidate');
const Vacancy = require('../models/Vacancy');
const Application = require('../models/Application');

// 1. Estadísticas para el Dashboard Principal
exports.getDashboardStats = async (req, res) => {
    try {
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalVacancies = await Vacancy.countDocuments();
        const totalApplications = await Application.countDocuments();
        
        // Asumiendo que guardas un estado de validación en el usuario o empresa
        // Aquí buscamos usuarios reclutadores que falten por validar
        const pendingCompanies = await User.find({ role: 'recruiter', status: 'pending' })
            .select('name email createdAt')
            .limit(5);

        res.json({
            stats: {
                totalCandidates,
                totalRecruiters,
                totalVacancies,
                totalApplications,
                estimatedRevenue: totalRecruiters * 1499 // Ejemplo: Multiplicado por el costo de tu plan
            },
            pendingCompanies
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo estadísticas');
    }
};

// 2. Obtener todos los usuarios reales
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo usuarios');
    }
};

// 3. Obtener Reportes de Plataforma (Empresas con más vacantes, promedio de IA)
exports.getPlatformReports = async (req, res) => {
    try {
        // A. Promedio Real del Score de IA (Solo toma las postulaciones que tengan score)
        const avgAiScore = await Application.aggregate([
            { $match: { ai_score: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgScore: { $avg: "$ai_score" } } }
        ]);
        const finalAvgScore = avgAiScore.length > 0 ? Math.round(avgAiScore[0].avgScore) : 0;

        // B. Top Empresas (Hace un join con la colección de Usuarios para sacar el nombre)
        const topCompanies = await Vacancy.aggregate([
            { $group: { _id: "$created_by", totalVacancies: { $sum: 1 } } },
            { $sort: { totalVacancies: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $project: { 
                name: { $ifNull: ["$user.companyName", { $ifNull: ["$user.name", "Empresa Desconocida"] }] },
                vacancies: "$totalVacancies",
                hires: { $literal: 0 } // Si después agregas un campo "contratados", lo pones aquí
            }}
        ]);

        // C. Gráfica de Postulaciones de los últimos 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Agrupamos postulaciones por día de la semana
        const recentApps = await Application.aggregate([
            { $match: { applied_at: { $gte: sevenDaysAgo } } }, 
            { $group: { _id: { $dayOfWeek: "$applied_at" }, count: { $sum: 1 } } }
        ]);

        // Mapeamos los resultados (1=Dom, 2=Lun... a nuestro arreglo [Lun, Mar, Mie, Jue, Vie, Sab, Dom])
        const rawChartData = [0, 0, 0, 0, 0, 0, 0];
        recentApps.forEach(app => {
            let index = app._id - 2; // Convertir Lunes(2) al índice 0
            if (index < 0) index = 6; // Domingo(1) pasa al índice 6
            rawChartData[index] = app.count;
        });

        // Calculamos el porcentaje de altura para que la barra no se salga del cuadro
        const maxApps = Math.max(...rawChartData, 1); // Evitar dividir por 0
        const chartPercentages = rawChartData.map(count => Math.round((count / maxApps) * 100));

        res.json({
            averageAiScore: finalAvgScore,
            topCompanies: topCompanies,
            chartData: chartPercentages, // Altura de la barra (0-100%)
            rawChartData: rawChartData   // Número real para mostrar cuando pasas el mouse
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo reportes');
    }
};

// 4. Obtener Empresas Pendientes de Validar
exports.getPendingCompanies = async (req, res) => {
    try {
        // Asumiendo que el User tiene un status 'pending'
        const pending = await User.find({ role: 'recruiter', status: 'pending' }).select('-password');
        res.json(pending);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo empresas pendientes');
    }
};

// 5. Validar o Rechazar Empresa
exports.validateCompany = async (req, res) => {
    try {
        const { action } = req.body; // 'approve' o 'reject'
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ msg: 'Empresa no encontrada' });

        if (action === 'approve') {
            user.status = 'active';
            await user.save();
            return res.json({ msg: 'Empresa Aprobada y Activa' });
        } else {
            // Si la rechazas, podrías eliminarla o cambiarla a status 'rejected'
            await User.findByIdAndDelete(req.params.id);
            return res.json({ msg: 'Empresa Rechazada y Eliminada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al validar');
    }
};