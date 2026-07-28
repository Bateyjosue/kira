"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
class WhatsAppService {
    static outgoingLog = [];
    static async sendMessage(phone, message) {
        const logEntry = {
            toPhone: phone,
            message,
            sentAt: new Date().toISOString(),
        };
        this.outgoingLog.push(logEntry);
        console.log(`\n📱 [WhatsApp Service Outgoing to ${phone}]:`);
        console.log(`----------------------------------------`);
        console.log(message);
        console.log(`----------------------------------------\n`);
        if (env_1.env.WHATSAPP_TOKEN && env_1.env.WHATSAPP_PHONE_NUMBER_ID && env_1.env.WHATSAPP_TOKEN !== 'mock_whatsapp_token') {
            try {
                await axios_1.default.post(`https://graph.facebook.com/v18.0/${env_1.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: phone,
                    type: 'text',
                    text: { body: message },
                }, {
                    headers: {
                        Authorization: `Bearer ${env_1.env.WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('✅ WhatsApp message sent via Meta Cloud API');
                return true;
            }
            catch (error) {
                console.warn('⚠️ Meta API send failed (using simulated log fallback):', error?.response?.data || error?.message);
            }
        }
        return true;
    }
    static getSentMessagesLog() {
        return this.outgoingLog;
    }
}
exports.WhatsAppService = WhatsAppService;
