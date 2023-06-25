import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { PrismaClient } from "@prisma/client";

const client = new Client();
const prisma = new PrismaClient();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on('message', async (message) => {
  if (message.type === 'location') {
    const { latitude, longitude, description } = message.location;

    try {
      const savedLocation = await prisma.location.create({
        data: {
          latitude: latitude,
          longitude: longitude,
          description: description,
        },
      });

      console.log('Location saved:', savedLocation);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
