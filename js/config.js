// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: 'Ae4y8pskNsADzerR0UEcN5WccZnZpzNGUwdMYG-IubRQqYqhQnW37l36trhr4nZ9Zv9PFYXdxTfh4a9p',
        currency: 'USD',
        environment: 'production'
    },
    // ID de tu Hoja de Cálculo
    spreadsheet: {
        id: '1Rm5UA4gHhttlUO61tJiqdNA4OS32MJwD0KwYFNu7KvU'
    },
    // URL de Implementación FINAL de Google Apps Script
    server: {
        endpoint: 'https://script.google.com/macros/s/AKfycbw3-LOEyVjR-cFTtxV-ne-ACOGB7MXkl4WG19qYQJKCWflMIoqJo_OrLtUtGaiz8wiB0Q/exec'
    },
    pricing: {
        vip: 0.10,
        gold: 0.10,
        diamond: 0.10
    },
    // CONFIGURACIÓN DE DISCORD
    discord: {
        serverId: '1441085570334982187',
        botToken: '',
        roleIds: {
            vip: '1441085570334982193',
            gold: '1441491511492743168',
            diamond: '1441491490810499213'
        }
    }
};

console.log('⚙️ CONFIG cargado - PRODUCCIÓN - $0.10 USD');