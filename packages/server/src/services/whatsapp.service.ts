import axios from 'axios';
import { env } from '../config/env';

export interface WhatsAppOutgoingMessage {
  toPhone: string;
  message: string;
  sentAt: string;
}

export class WhatsAppService {
  private static outgoingLog: WhatsAppOutgoingMessage[] = [];

  static async sendMessage(phone: string, message: string): Promise<boolean> {
    const logEntry: WhatsAppOutgoingMessage = {
      toPhone: phone,
      message,
      sentAt: new Date().toISOString(),
    };
    this.outgoingLog.push(logEntry);

    console.log(`\n📱 [WhatsApp Service Outgoing to ${phone}]:`);
    console.log(`----------------------------------------`);
    console.log(message);
    console.log(`----------------------------------------\n`);

    if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_TOKEN !== 'mock_whatsapp_token') {
      try {
        await axios.post(
          `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phone,
            type: 'text',
            text: { body: message },
          },
          {
            headers: {
              Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('✅ WhatsApp message sent via Meta Cloud API');
        return true;
      } catch (error: any) {
        console.warn('⚠️ Meta API send failed (using simulated log fallback):', error?.response?.data || error?.message);
      }
    }

    return true;
  }

  static getSentMessagesLog(): WhatsAppOutgoingMessage[] {
    return this.outgoingLog;
  }
}
