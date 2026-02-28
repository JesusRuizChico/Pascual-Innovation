// backend-selectia/src/controllers/chatController.js
const axios = require('axios');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // 1. Obtener contexto básico del usuario
        let contextData = {
            role: userRole,
            userId: userId,
            name: req.user.name 
        };

        // Si es candidato, buscamos su perfil para pasarle sus skills a la IA
        if (userRole === 'candidate') {
            console.log("🔍 Buscando perfil de candidato para UserID:", userId);

            const candidate = await Candidate.findOne({ user: userId });
            
            console.log("📄 Resultado de la búsqueda:", candidate ? "Encontrado" : "Null");

            if (candidate) {
                console.log("✅ Skills encontradas:", candidate.skills);
                contextData.skills = candidate.skills;
                contextData.experience = candidate.experience_years;
                contextData.name = candidate.full_name || contextData.name || "Candidato";
            } else {
                console.log("❌ NO se encontró perfil de candidato para este usuario.");
            }
        } 
        // ---------------------------------------------------------
        // 👇 AQUÍ ESTÁ LO NUEVO PARA EL RECLUTADOR 👇
        // ---------------------------------------------------------
        else if (userRole === 'recruiter') {
            console.log("🔍 Buscando la base de datos de candidatos para el Reclutador...");
            
            // Buscamos a TODOS los candidatos en la base de datos
            const candidatosDb = await Candidate.find({}); 
            
            // Filtramos solo la información útil para no saturar a la IA
            const listaCandidatos = candidatosDb.map(c => ({
                nombre: c.full_name,
                habilidades: c.skills,
                experiencia: c.experience_years + " años",
                titulo: c.title
            }));

            // Guardamos la lista en el contexto que viajará a n8n
            contextData.candidates = listaCandidatos;
            console.log(`✅ Se enviarán ${listaCandidatos.length} candidatos a n8n para su análisis.`);
        }
        // ---------------------------------------------------------
        // 👆 FIN DE LO NUEVO 👆
        // ---------------------------------------------------------

        console.log("📤 Enviando a n8n:", contextData);

        // 2. ENVIAR A N8N (Webhook de Chat)
        const N8N_CHAT_URL = 'http://localhost:5678/webhook-test/chat-bot'; 
        
        let aiResponse = "";

        try {
            const n8nRes = await axios.post(N8N_CHAT_URL, {
                prompt: message,
                context: contextData
            });
            
            aiResponse = n8nRes.data.response || n8nRes.data.text || "Respuesta recibida de n8n";

        } catch (n8nError) {
            console.error("Error conectando con n8n:", n8nError.message);
            if (userRole === 'recruiter') {
                aiResponse = "Modo Offline: No puedo analizar CVs en este momento, pero puedo decirte que el sistema de vacantes está activo.";
            } else {
                aiResponse = "Modo Offline: Para preguntas sobre vacantes específicas, por favor intenta más tarde.";
            }
        }

        res.json({ response: aiResponse });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el chat');
    }
};