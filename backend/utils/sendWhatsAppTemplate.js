// import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// export const sendCheckInQR = async (Image, token, mobile) => {
//   try {
//     const response = await axios({
//       url: `${process.env.WHATSAPP_URL}`,
//       method: "post",
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_API}`,
//         "Content-Type": "application/json",
//       },
//       data: JSON.stringify({
//         messaging_product: "whatsapp",
//         to: `+91${mobile}`,
//         type: "image",
//         image: {
//           link: Image,
//           caption: token,
//         },
//       }),
//     });
//     console.log(response.data);
//   } catch (err) {
//     console.error("WhatsApp message error:", err.response?.data || err.message);
//   }
// };
const accountSid = process.env.T_SID;
const authToken = process.env.T_AUTH;
import twilio from "twilio";

const client = twilio(accountSid, authToken);

export const sendCheckInQR = async (image, /* token, */ mobile) => {
  try {
    client.messages
      .create({
        from: "whatsapp:+14155238886",
        mediaUrl: [image],
        to: `whatsapp:+91${mobile}`,
      })
      .then((message) => console.log(message.sid));
  } catch (error) {
    console.log(error);
  }
};
