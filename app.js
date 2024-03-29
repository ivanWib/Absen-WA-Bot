import qrcode from "qrcode-terminal";
import { writeFileSync } from "fs";
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

client.on("message", async (message) => {
  const command = "!absen";
  const name = message.body.slice(command.length).trim();

  if (message.body.startsWith(command) && name) {
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      const mimeType = media.mimetype.split("/")[1];
      const filename = `${name}.${mimeType}`;
      const decodedImage = Buffer.from(media.data, "base64");

      writeFileSync(`uploads/${filename}`, decodedImage);

      console.log(`Gambar ${filename} berhasil didownload dan dideskripsi!`);

      // location
      const location = message.location;
      const latitude = location.latitude;
      const longitude = location.longitude;
      const description = location.description;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Description:", description);

      getLocation = new Location(latitude, longitude, description);
      console.log(getLocation);

      const absen = await prisma.user.create({
        data: {
          name: name,
          photo: filename,
          location: getLocation,
        },
      });

      console.log(
        "Data berhasil disimpan ke database! \nNama : " +
          name +
          " \nPhoto : " +
          filename
      );

      client.sendMessage(
        message.from,
        "Data berhasil disimpan ke database! \nNama : " +
          name +
          " \nPhoto : " +
          filename
      );
    } else {
      client.sendMessage(
        message.from,
        "Gambar tidak ditemukan!, silahkan kirim ulang gambar"
      );
    }
  }
});

client.on("message", async (message) => {});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
