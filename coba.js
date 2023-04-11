import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cobaNama = "Ivan";
const cobaPhoto = "Ivan.jpg";

const absen = await prisma.user.create({
  data: {
    name: cobaNama,
    photo: cobaPhoto,
  },
});
