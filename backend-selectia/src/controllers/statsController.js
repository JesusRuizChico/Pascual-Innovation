// backend-selectia/src/controllers/statsController.js
const User = require('../models/User');
const Vacancy = require('../models/Vacancy');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');

// --- ESTADÍSTICAS PARA EL RECLUTADOR ---
exports.getRecruiterStats = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // 1. Total de Vacantes del usuario
        const totalVacancies = await Vacancy.countDocuments({ created_by: recruiterId });
        
        // 2. Total de Vacantes Activas
        const activeVacancies = await Vacancy.countDocuments({ created_by: recruiterId, status: 'activa' });

        // 3. Obtener IDs de mis vacantes para buscar postulaciones
        const myVacancies = await Vacancy.find({ created_by: recruiterId }).select('_id');
        const myVacancyIds = myVacancies.map(v => v._id);

        // 4. Total de Candidatos (Postulaciones recibidas)
        const totalCandidates = await Application.countDocuments({ vacancy: { $in: myVacancyIds } });

        // 5. Candidatos Nuevos (status: 'nuevo')
        const newCandidates = await Application.countDocuments({ vacancy: { $in: myVacancyIds }, status: 'nuevo' });

        res.json({
            totalVacancies,
            activeVacancies,
            totalCandidates,
            newCandidates
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error al obtener estadísticas');
    }
};

// --- ESTADÍSTICAS PARA EL ADMIN (GLOBALES) ---
exports.getAdminStats = async (req, res) => {
    try {
        // Solo permitir admin (doble verificación aparte del middleware)
        if(req.user.role !== 'admin') return res.status(403).json({msg: 'Acceso denegado'});

        const totalUsers = await User.countDocuments();
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalVacancies = await Vacancy.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Ingresos simulados (Multiplicamos reclutadores * precio plan)
        const estimatedRevenue = totalRecruiters * 1500; 

        res.json({
            totalUsers,
            totalCandidates,
            totalRecruiters,
            totalVacancies,
            totalApplications,
            estimatedRevenue
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// --- DESCARGAR REPORTE CSV (CORREGIDO: Incluye Email) ---
exports.downloadReport = async (req, res) => {
    try {
        // 1. Obtener vacantes del reclutador
        const myVacancies = await Vacancy.find({ created_by: req.user.id });
        const vacancyIds = myVacancies.map(v => v._id);

        // 2. Obtener postulaciones con "Deep Populate" para sacar el email del Usuario
        const applications = await Application.find({ vacancy: { $in: vacancyIds } })
            .populate({
                path: 'candidate',
                select: 'full_name phone', // Datos del perfil de candidato
                populate: {
                    path: 'user',
                    select: 'email' // <--- AQUÍ TRAEMOS EL EMAIL DEL USUARIO (LOGIN)
                }
            })
            .populate('vacancy', 'title');

        // 3. Construir CSV
        // \ufeff es el BOM para que Excel abra bien los acentos
        let csv = '\ufeffCandidato,Email,Telefono,Vacante,Estado,Match IA,Fecha Postulacion\n';

        applications.forEach(app => {
            const date = new Date(app.applied_at).toLocaleDateString();
            
            // Extracción segura de datos
            const name = app.candidate?.full_name || 'Desconocido';
            
            // CORRECCIÓN: El email viene de candidate.user.email
            const email = app.candidate?.user?.email || 'No registrado';
            
            const phone = app.candidate?.phone || 'N/A';
            const title = app.vacancy?.title || 'Vacante eliminada';
            
            // Limpiar comas en los textos para no romper el CSV
            const cleanName = name.replace(/,/g, '');
            const cleanTitle = title.replace(/,/g, '');

            csv += `${cleanName},${email},${phone},"${cleanTitle}",${app.status},${app.ai_score}%,${date}\n`;
        });

        // 4. Enviar archivo
        res.header('Content-Type', 'text/csv');
        res.attachment('reporte_selectia.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar reporte');
    }
};

// --- REPORTE AVANZADO DE CONVERSIÓN DE CANDIDATOS POR VACANTE ---
exports.getConversionReport = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // 1. Obtener IDs de las vacantes del reclutador de manera eficiente y directa
        const myVacancies = await Vacancy.find({ created_by: recruiterId }).select('_id');
        const myVacancyIds = myVacancies.map(v => v._id);

        if (myVacancyIds.length === 0) {
            return res.json([]);
        }

        // 2. Ejecutar la tubería de agregación altamente eficiente en Application
        const conversionReport = await Application.aggregate([
            // Filtrar las postulaciones de las vacantes de este reclutador
            // Usando un índice en la referencia 'vacancy' para máxima velocidad
            {
                $match: {
                    vacancy: { $in: myVacancyIds }
                }
            },
            // Agrupar por vacante y contar ocurrencias de cada estado
            {
                $group: {
                    _id: "$vacancy",
                    totalApplications: { $sum: 1 },
                    nuevo: { $sum: { $cond: [{ $eq: ["$status", "nuevo"] }, 1, 0] } },
                    entrevista: { $sum: { $cond: [{ $eq: ["$status", "entrevista"] }, 1, 0] } },
                    rechazado: { $sum: { $cond: [{ $eq: ["$status", "rechazado"] }, 1, 0] } },
                    contratado: { $sum: { $cond: [{ $eq: ["$status", "contratado"] }, 1, 0] } },
                    avgAiScore: { $avg: "$ai_score" }
                }
            },
            // Unir con la colección de Vacancies después de agrupar para evitar realizar un $lookup
            // costoso en todos los documentos de postulaciones antes del agrupamiento (Optimización Clave)
            {
                $lookup: {
                    from: "vacancies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "vacancyDetails"
                }
            },
            // Aplanar el array resultante de la unión
            {
                $unwind: "$vacancyDetails"
            },
            // Proyectar el reporte final calculando las métricas de conversión avanzada
            {
                $project: {
                    _id: 0,
                    vacancyId: "$_id",
                    title: "$vacancyDetails.title",
                    modality: "$vacancyDetails.modality",
                    status: "$vacancyDetails.status",
                    created_at: "$vacancyDetails.created_at",
                    totalApplications: 1,
                    nuevo: 1,
                    entrevista: 1,
                    rechazado: 1,
                    contratado: 1,
                    avgAiScore: { $round: ["$avgAiScore", 1] },
                    conversionRates: {
                        interviewRate: {
                            $cond: [
                                { $gt: ["$totalApplications", 0] },
                                { $round: [{ $multiply: [{ $divide: [{ $add: ["$entrevista", "$contratado"] }, "$totalApplications"] }, 100] }, 2] },
                                0
                            ]
                        },
                        hireRate: {
                            $cond: [
                                { $gt: ["$totalApplications", 0] },
                                { $round: [{ $multiply: [{ $divide: ["$contratado", "$totalApplications"] }, 100] }, 2] },
                                0
                            ]
                        }
                    }
                }
            },
            // Ordenar por volumen total de postulaciones de forma descendente
            {
                $sort: { totalApplications: -1 }
            }
        ]);

        res.json(conversionReport);

    } catch (error) {
        console.error("Error al generar reporte de conversión:", error);
        res.status(500).json({ error: "Error al generar reporte de conversión" });
    }
};