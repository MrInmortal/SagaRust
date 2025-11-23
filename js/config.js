// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: 'Ae4y8pskNsADzerR0UEcN5WccZnZpzNGUwdMYG-IubRQqYqhQnW37l36trhr4nZ9Zv9PFYXdxTfh4a9p',
        currency: 'USD',
        environment: 'production'
    },
    // <<< REEMPLAZA ESTE ID >>>
    spreadsheet: {
        id: '1Rm5UA4gHhttlUO61tJiqdNA4OS32MJwD0KwYFNu7KvU'
    },
    // <<< REEMPLAZA ESTA URL CON TU URL DE IMPLEMENTACIÓN DEL APPS SCRIPT >>>
    server: {
        endpoint: 'https://script.google.com/macros/s/AKfycbyVRW6x3sZnx0Ywhx8as-sGpa-C0hreDRdbevi4jgzzyrlxjtUh74CpjGQLTV2Y6wDh-A/exec' 
    },
    pricing: {
        vip: 0.10,
        gold: 0.10,
        diamond: 0.10
    },
    // >>> CONFIGURACIÓN DE DISCORD <<<
    discord: {
        serverId: '1441085570334982187', // ID del servidor de Discord
        // <<< REEMPLAZA ESTE TOKEN >>>
        botToken: 'MTQ0MjE4NDQ2ODiyMjk2NzkyMA.GHft4N.0HjSOhImUkxuzTvG_X02-tA2UXKybLzNM-Dmyk', 
        roleIds: {
            vip: '1441085570334982193', // ID VIP
            gold: '1441491511492743168', // ID VIP oro
            diamond: '1441491490810499213' // ID VIP diamante
        }
    }
};

console.log('⚙️ CONFIG cargado - PRODUCCIÓN - $0.10 USD');