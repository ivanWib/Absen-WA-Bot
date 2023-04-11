const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client } = require("whatsapp-web.js");
const { Prisma } = require("@prisma/client");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  console.log(" ");
  console.log(message.body);
  console.log("------------------");
  console.log(message.from);
  console.log("------------------");
  const date = Date(message.timestamp * 1000);
  console.log(date);

  // Untuk mengecek apakah pesan yang diterima memiliki media atau tidak
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    const mimeType = media.mimetype.split("/")[1];
    const filename = `${Date.now()}.${mimeType}`;

    // Menyimpan data gambar dalam format Base64 ke file
    fs.writeFileSync(filename, media.data, { encoding: "base64" });

    // Membaca data gambar dari file dan mendecode dari format Base64 ke gambar
    const decodedImage = Buffer.from(media.data, "base64");

    // Simpan gambar ke file
    fs.writeFileSync(`decoded_${filename}`, decodedImage);

    console.log(`Gambar ${filename} berhasil didownload dan dideskripsi!`);
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
