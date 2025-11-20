// Configuration EmailJS
const EMAILJS_SERVICE_ID = 'service_4ab2q68';
const EMAILJS_TEMPLATE_ID = 'template_default';
const EMAILJS_PUBLIC_KEY = '4gEzT9DkXPjvp2WxD';
const EMAILJS_PRIVATE_KEY = '87XD4FLgvOuhgMZPhzdaK';

// Initialiser EmailJS
function initEmailJS() {
    try {
        // Vérifier si EmailJS est disponible
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            console.log('EmailJS initialisé avec succès');
        } else {
            console.warn('EmailJS non disponible');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation d\'EmailJS:', error);
    }
}

// Envoyer un email de contact
async function sendContactEmail(formData) {
    try {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS non disponible, simulation d\'envoi');
            return simulateEmailSend(formData);
        }
        
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            to_email: 'ctlpowerr@gmail.com'
        };
        
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email envoyé avec succès:', response);
        return { success: true, message: 'Email envoyé avec succès' };
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { 
            success: false, 
            message: 'Erreur lors de l\'envoi de l\'email: ' + error.text 
        };
    }
}

// Simuler l'envoi d'email (fallback)
function simulateEmailSend(formData) {
    console.log('Simulation d\'envoi d\'email:', formData);
    
    // Simuler un délai d'envoi
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                message: 'Message simulé envoyé avec succès' 
            });
        }, 1000);
    });
}

// Envoyer un email de notification d'administration
async function sendAdminNotification(subject, message) {
    try {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS non disponible, simulation d\'envoi');
            return simulateEmailSend({ subject, message });
        }
        
        const templateParams = {
            subject: subject,
            message: message,
            to_email: 'ctlpowerr@gmail.com'
        };
        
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            'template_admin_notification',
            templateParams
        );
        
        console.log('Notification admin envoyée avec succès:', response);
        return { success: true, message: 'Notification envoyée avec succès' };
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        return { 
            success: false, 
            message: 'Erreur lors de l\'envoi de la notification' 
        };
    }
}

// Exporter les fonctions
window.emailFunctions = {
    initEmailJS,
    sendContactEmail,
    sendAdminNotification
};
