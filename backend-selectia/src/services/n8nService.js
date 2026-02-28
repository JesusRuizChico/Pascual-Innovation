// backend-selectia/src/services/n8nService.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// URL de tu Webhook de n8n (La obtendrás en n8n)
// Por ahora pon una de ejemplo o la de tu local si ya la tienes
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/analizar-cv'; 

exports.analizarCvConIA = async (filePath) => {
    try {
        // 1. Preparamos el archivo para enviarlo
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        // 2. Enviamos el archivo a n8n
        console.log("📡 Enviando CV a n8n para análisis...");
        const response = await axios.post(N8N_WEBHOOK_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // 3. n8n nos debe devolver un JSON con los datos extraídos
        // Ejemplo esperado: { skills: ['React', 'Node'], experience: [...], summary: "..." }
        console.log("🤖 IA respondió:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ Error conectando con n8n:", error.message);
        return null; // Si falla, no rompemos la subida, solo no hay análisis automático
    }
};