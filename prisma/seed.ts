import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  let hotel = await prisma.hotel.findFirst();
  let room = await prisma.room.findFirst();
  let user = await prisma.user.findFirst();
  let booking = await prisma.booking.findFirst();

  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        name: "Driven.t hotel",
        image: "https://files.driveneducation.com.br/images/logo-rounded.png",
        updatedAt: dayjs().toDate()
      },
    });
  }

  if (!room) {
    room = await prisma.room.create({
      data: {
        name: "Driven.t room",
        capacity: 3,
        hotelId: hotel.id,
        updatedAt: dayjs().toDate()
      },
    });
  }

  if (!user) {
    const hashedPassword = await bcrypt.hash("123456", 12);
    user = await prisma.user.create({
      data: {
        email: "email@email.com",
        password: hashedPassword,
        updatedAt: dayjs().toDate()
      },
    });
  }

  if (!booking) {
    booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: room.id,
        updatedAt: dayjs().toDate()
      },
    });
  }

  console.log({ event, hotel, room, user, booking });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
