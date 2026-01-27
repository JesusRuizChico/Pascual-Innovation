// backend-selectia/src/controllers/notificationController.js
const Notification = require('../models/Notification');

// Obtener mis notificaciones
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ created_at: -1 }) // Ordenar por fecha de creación
            .limit(20); 
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
};

// --- CORREGIDO: Marcar UNA como leída (Fuerza bruta) ---
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;

        // Usamos findOneAndUpdate porque es ATÓMICO.
        // Busca y actualiza en un solo paso directo a la base de datos.
        const updatedNotification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId }, // Filtro: Que coincida ID y Usuario
            { $set: { read: true } },              // Acción: Forzar read a true
            { new: true }                          // Opción: Devolver el dato actualizado
        );

        if (!updatedNotification) {
            return res.status(404).json({ msg: 'Notificación no encontrada o no te pertenece' });
        }

        res.json({ msg: 'Notification marked as read', notification: updatedNotification });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating notification');
    }
};

// Marcar TODAS como leídas
exports.markAllRead = async (req, res) => {
    try {
        // También usamos updateMany para asegurar que se guarden
        await Notification.updateMany(
            { user: req.user.id, read: false }, 
            { $set: { read: true } }
        );
        res.json({ msg: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating notifications');
    }
};

// Eliminar notificación
exports.deleteNotification = async (req, res) => {
    try {
        // Usamos findOneAndDelete para asegurar que solo borres las tuyas
        const deleted = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });

        if (!deleted) {
            return res.status(404).json({ msg: 'No se encontró la notificación' });
        }

        res.json({ msg: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting notification');
    }
};