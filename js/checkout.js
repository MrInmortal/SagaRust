// js/checkout.js - Lógica de PayPal y envío de datos
let vipConfig = {}; 
const APPS_SCRIPT_URL = CONFIG.server.endpoint;

// Función para obtener la configuración del VIP actual (del navigation.js)
function getVipConfig(vipType) {
    // Se asume que vipData está disponible globalmente desde navigation.js
    return vipData[vipType]; 
}

// Validar formulario
function validarFormulario() {
    const steamId = document.getElementById('steam-id')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const name = document.getElementById('name')?.value.trim();
    const discord = document.getElementById('discord')?.value.trim();
    const terms = document.getElementById('terms')?.checked;
    
    if (!steamId || !email || !name || !discord || !terms) {
        alert('❌ Por favor, completa todos los campos obligatorios y acepta los términos.');
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('❌ Email inválido. Por favor, revisa tu correo electrónico.');
        return false;
    }
    
    // Guardar los datos del formulario localmente
    localStorage.setItem('sagaRustFormData', JSON.stringify({
        steamId: steamId,
        email: email,
        name: name,
        discord: discord
    }));
    
    return true;
}

// Función para enviar datos al Google Apps Script (Backend)
async function enviarDatosPago(formData) {
    try {
        console.log('📤 Enviando a servidor con datos de Discord:', formData);
        
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const text = await response.text();
        
        let result;
        try {
            result = JSON.parse(text);
        } catch(e) {
            console.error("No se pudo parsear el JSON. Posible respuesta HTML de Apps Script:", text);
            // Intentar extraer el JSON si está envuelto (solución temporal para entornos locales)
            const match = text.match(/\{"success":.*?\}/);
            if (match) {
                result = JSON.parse(match[0]);
            } else {
                throw new Error("Respuesta del servidor no válida. Revise el Apps Script.");
            }
        }

        console.log('✅ Resultado del servidor:', result);
        
        if (result.success) {
            // Actualizar estado de pago
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(76, 175, 80, 0.2)';
                statusDiv.style.border = '2px solid #4CAF50';
                statusDiv.style.color = '#4CAF50';
                
                let discordMsg = '⏳ Procesando...';
                if (result.discordStatus === 'ROL_ASIGNADO') {
                    discordMsg = '✅ Rol asignado';
                } else if (result.discordStatus === 'ERROR_ASIGNACION') {
                    discordMsg = '⚠️ Revisar manualmente';
                }

                statusDiv.innerHTML = `
                    <strong>✅ ¡Compra exitosa!</strong><br>
                    <small>Rol Discord: ${discordMsg}</small>
                `;
            }
            
            // Mostrar modal de éxito
            setTimeout(() => {
                showSuccessModal(formData, result);
            }, 1500);
        } else {
            throw new Error(result.error || 'Error desconocido del servidor');
        }
        
    } catch (error) {
        console.error('❌ Error enviando datos:', error);
        const statusDiv = document.getElementById('payment-status');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = 'rgba(255, 0, 0, 0.2)';
            statusDiv.style.border = '2px solid #ff0000';
            statusDiv.style.color = '#ff0000';
            statusDiv.innerHTML = `<strong>❌ Error:</strong><br><small>No se pudo contactar/procesar: ${error.message}</small>`;
        }
    }
}

// Función para mostrar el modal de éxito (tomada de paypal.js)
function showSuccessModal(data, result) {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    
    let discordStatusMsg = '⏳ Procesando rol de Discord...';
    let discordColor = '#ffa500';
    
    if (result.discordStatus === 'ROL_ASIGNADO') {
        discordStatusMsg = '✅ Rol de Discord asignado automáticamente';
        discordColor = '#4CAF50';
    } else if (result.discordStatus === 'ERROR_ASIGNACION' || result.discordStatus === 'ERROR_ASIGNACION_NO_ID' || result.discordStatus === 'ERROR_BUSCANDO_USUARIO') {
        discordStatusMsg = '⚠️ Rol pendiente - Contacta soporte con tu Transaction ID. Razón: Error de asignación.';
        discordColor = '#ff6b6b';
    } else if (result.discordStatus === 'NO_DISCORD_INFO') {
        discordStatusMsg = '⚠️ Rol pendiente - Falta información de Discord';
        discordColor = '#ff6b6b';
    }
    
    content.innerHTML = `
        <span class="success-icon">✓</span>
        <h2>¡Compra Exitosa!</h2>
        <p style="font-size:1.2rem;margin:10px 0;"><strong>${data.vipTitle}</strong></p>
        <div style="text-align:left;background:rgba(255,255,255,0.1);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="margin:8px 0;"><strong>Steam ID:</strong> ${data.steamId}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:8px 0;"><strong>Discord:</strong> ${data.discord}</p>
            <p style="margin:8px 0;"><strong>Transacción:</strong> ${data.transactionId}</p>
            <p style="margin:8px 0;"><strong>Monto:</strong> $${data.amount} USD</p>
        </div>
        <div style="background:${discordColor};padding:20px;border-radius:8px;margin:20px 0;">
            <p style="color:#fff;margin:0;font-size:1rem;">
                ${discordStatusMsg}
            </p>
        </div>
        <div style="background:linear-gradient(135deg,#43a047,#66bb6a);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="color:#fff;margin:0;font-size:1.1rem;">
                <strong>✅ Pago Confirmado</strong><br><br>
                📧 Confirmación enviada a:<br><strong>${data.email}</strong>
            </p>
        </div>
        <button class="btn" onclick="closeModal()" style="background:#ff8c00;width:100%;padding:15px;">Entendido</button>
    `;
    modal.classList.add('active');
}

// Inicializar el botón de PayPal
function initPayPalButton(vipType) {
    const container = document.getElementById('paypal-button-container');
    const config = getVipConfig(vipType); 
    
    if (!config) {
        console.error('❌ VIP no válido para PayPal');
        container.innerHTML = '<p style="color:#ff6b6b;text-align:center;">Error: VIP no válido</p>';
        return;
    }
    
    console.log('🎯 Inicializando PayPal para:', vipType);
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 55
        },

        createOrder: function(data, actions) {
            // FIX: Usar Promise.reject() en lugar de actions.reject()
            if (!validarFormulario()) {
                alert('❌ Por favor, rellena todos los campos del formulario y acepta los términos antes de proceder al pago.');
                return Promise.reject(new Error('Formulario incompleto o datos inválidos.'));
            }
            
            const selectedConfig = getVipConfig(vipType);

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: selectedConfig.priceValue.toFixed(2), 
                        currency_code: 'USD'
                    },
                    description: `${selectedConfig.title} - Saga Rust`
                }]
            });
        },

        onApprove: function(data, actions) {
            console.log('✅ Pago aprobado');
            
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(255, 165, 0, 0.2)';
                statusDiv.style.border = '2px solid #ffa500';
                statusDiv.style.color = '#ffa500';
                statusDiv.innerHTML = '<strong>🔄 Procesando y asignando rol...</strong>';
            }
            
            return actions.order.capture().then(function(details) {
                // Construir el objeto de datos para enviar al Apps Script 
                const selectedConfig = getVipConfig(vipType);
                
                const formData = {
                    steamId: document.getElementById('steam-id').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    name: document.getElementById('name').value.trim(),
                    discord: document.getElementById('discord').value.trim().split('#')[0],
                    vipType: vipType,
                    vipTitle: selectedConfig.title,
                    transactionId: data.orderID,
                    paypalOrderId: details.id,
                    amount: selectedConfig.priceValue.toFixed(2),
                    status: 'COMPLETADO',
                    payerEmail: details.payer.email_address,
                    payerName: `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim(),
                    // DATOS DE DISCORD OBTENIDOS DEL CONFIG.JS
                    discordServerId: CONFIG.discord.serverId,
                    discordRoleId: CONFIG.discord.roleIds[vipType], 
                    botToken: CONFIG.discord.botToken 
                };
                
                return enviarDatosPago(formData);
            });
        },

        onError: function(err) {
            console.error('❌ Error PayPal:', err);
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                 statusDiv.style.display = 'block';
                 statusDiv.style.background = 'rgba(255, 0, 0, 0.2)';
                 statusDiv.style.border = '2px solid #ff0000';
                 statusDiv.style.color = '#ff0000';
                 statusDiv.innerHTML = '<strong>❌ Error en el pago de PayPal</strong>';
            }
        },

        onCancel: function() {
            console.log('🚫 Pago cancelado');
        }

    }).render('#paypal-button-container')
      .then(() => console.log('✅ Botón PayPal renderizado'))
      .catch(err => {
          console.error('❌ Error renderizando PayPal:', err);
          container.innerHTML = '<p style="color:#ff6b6b;text-align:center;">Error al cargar PayPal. Intenta recargar la página.</p>';
      });
}


// Inicialización del Checkout
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Checkout cargado - Inicializando PayPal');
    // loadCheckoutSummary debe estar en navigation.js y debe cargarse antes de checkout.js
    if (typeof loadCheckoutSummary === 'function') {
        loadCheckoutSummary(); 
    } else {
        console.error("Función loadCheckoutSummary no encontrada. Asegura que navigation.js está cargado.");
    }
    
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType) {
        window.location.href = 'index.html';
        return;
    }
    
    console.log('✅ VIP seleccionado:', vipType);
    
    // Esperar a que PayPal cargue
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkPayPal = setInterval(() => {
        attempts++;
        
        if (typeof paypal !== 'undefined') {
            clearInterval(checkPayPal);
            console.log('✅ PayPal SDK cargado');
            initPayPalButton(vipType);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkPayPal);
            console.error('❌ PayPal no cargó a tiempo');
            document.getElementById('paypal-button-container').innerHTML = 
                '<p style="color:#ff6b6b;text-align:center;">Error al cargar PayPal. <button onclick="location.reload()" class="btn">Recargar</button></p>';
        }
    }, 100);
});