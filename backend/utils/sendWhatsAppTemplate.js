import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const META_API_URL = `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_NUMBER_ID}/messages`;

export const sendWhatsAppTemplate = async (toPhoneNumber, templateName, params = []) => {
  try {
    await axios.post(META_API_URL, {
      messaging_product: "whatsapp",
      to: `91${toPhoneNumber.replace(/^0+/, '')}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [{
          type: "body",
          parameters: params.map(p => ({ type: "text", text: p }))
        }]
      }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.error("WhatsApp message error:", err.response?.data || err.message);
  }
};
